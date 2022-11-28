const {
  EmbedBuilder, ApplicationCommandOptionType, ApplicationCommandType,
} = require('discord.js')
const { InteractionResponseType } = require('discord-interactions')
const { capitalize } = require('../utils/misc')
const { request } = require('../utils/requests')

const hour24 = {
  type: ApplicationCommandOptionType.Subcommand,
  name: '24h',
  description: 'Get 24 hour weather forecast for a city',
  options: [
    {
      type: 3,
      name: 'query',
      description: 'names of cities separated by a comma',
      required: true,
    },
  ],
}

const current = {
  type: ApplicationCommandOptionType.Subcommand,
  name: 'current',
  description: 'Get 24 hour weather forecast for a city',
  options: [
    {
      type: 3,
      name: 'query',
      description: 'Name of the city',
      required: true,
    },
  ],
}

const weather = {
  type: ApplicationCommandType.ChatInput,
  description: 'Weather commands',
  name: 'weather',
  options: [
    hour24,
    current,
  ],
}

const baseUrl = 'https://api.openweathermap.org/data/2.5/forecast?units=metric&lang=en&'

const getCurrentWeather = async city => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHERTOKEN}&units=metric`
  const res = await request(url, { method: 'get' })
  return res ? res.data : null
}

const getForecast = async (city) => {
  const endpoint = `q=${city}&appid=${process.env.WEATHERTOKEN}`
  const url = baseUrl + endpoint
  const res = await request(url, { method: 'get' })
  return res ? res.data : null
}

const parseDate = (date) => date.toLocaleString('fi-FI', { day: '2-digit', month: '2-digit' })

const getForecastLine = (fc, date) => {
  let emoji
  const mainToEmoji = {
    Thunderstorm: '⛈⚡',
    Drizzle: '🌦',
    Rain: '🌧',
    Snow: '❄️',
    Mist: '🌫',
    Clear: '🌞',
    Clouds: '☁️',
  }
  emoji = mainToEmoji[fc.weather[0].main]
  if (emoji === '☁️') {
    const betterClouds = {
      801: '🌤',
      802: '⛅️',
      803: '☁️',
      804: '☁️',
    }
    emoji = betterClouds[fc.weather[0].id]
  }

  if (emoji === undefined) {
    emoji = '🌫'
  }

  return `${date.toLocaleString('fi-FI', { hour: '2-digit', minute: '2-digit' })} | ${Math.round(fc.main.temp)} C ${emoji}\n`
}

const parseForecast = (forecast) => {
  const { city, list, timezone } = forecast

  if (!list) { return null }
  const date = new Date(0)
  date.setUTCSeconds(list[0].dt + timezone)
  const parsedCity = capitalize(city)

  let str = ''

  for (let i = 0; i < 8; i++) {
    const fc = list[i]
    const dateFc = new Date(0)
    dateFc.setUTCSeconds(fc.dt + timezone)
    const temp = getForecastLine(fc, dateFc)
    str += temp
  }

  return {
    city: parsedCity,
    dateStr: parseDate(date),
    str,
  }
}

const get24hEmbed = (data, img) => {
  const weatherEmbed = new EmbedBuilder()
    .setColor(0x8a00c2)
    .setTitle('Weather forecast')
    .setThumbnail(`http://openweathermap.org/img/wn/${img}@2x.png`)

  data.forEach(forecast => {
    const { city, dateStr, str } = forecast
    weatherEmbed
      .addFields(
        { name: `${city} forecast ${dateStr}\n🕒 | Temperature`, value: str },
      )
  })
  weatherEmbed.setFooter({ text: 'CreaBot' }).setTimestamp()

  return { embeds: [weatherEmbed] }
}

const forecastAndPopulate = async (query) => {
  const forecasts = []
  const cities = query.split(/,\s*/)

  // Get forecasts
  for await (const city of cities) {
    const forecast = await getForecast(city)

    if (!forecast) return { content: `Weather not found with: ${city}` }
    forecasts.push({
      city,
      list: forecast.list,
      timezone: forecast.city.timezone,
    })
  }
  const img = forecasts[0].list[0].weather[0].icon
  const parsedForecasts = []
  // Build forecast strings
  for (const fc of forecasts) {
    const parsedForecast = parseForecast(fc)
    if (parsedForecast) { parsedForecasts.push(parsedForecast) }
  }

  // Build embed
  return get24hEmbed(parsedForecasts, img)
}

const checkInvalid = async city => {
  const forecast = await getForecast(city)
  if (!forecast) { return true }
  return false
}

const handle24h = async (req, res) => {
  const query = req.subCommand.options[0].value

  const data = await forecastAndPopulate(query)

  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data,
  })
}

const getCurrentForecastEmbed = async (city) => {
  const forecast = await getCurrentWeather(city)
  if (!forecast) return { content: `Weather not found with: ${city}` }

  const {
    main, wind, sys,
  } = forecast

  const sunrise = new Date(0)
  const sunset = new Date(0)
  sunrise.setUTCSeconds(sys.sunrise + forecast.timezone)
  sunset.setUTCSeconds(sys.sunset + forecast.timezone)
  const image = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`
  const embed = new EmbedBuilder()
    .setTitle(`Weather ${forecast.name}`)
    .setImage(image)
    .setThumbnail(image)
    .setDescription(`${forecast.weather[0].main}: ${forecast.weather[0].description}`)
    .addFields(
      { name: 'Temp', value: `${main.temp} C`, inline: true },
      { name: 'Feels like', value: `${main.feels_like} C`, inline: true },
      { name: '\u200B', value: '\u200B' },
    )
    .addFields(
      { name: 'Pressure', value: `${main.pressure} Pa`, inline: true },
      { name: 'Humidity', value: `${main.humidity}`, inline: true },
      { name: '\u200B', value: '\u200B' },
    )
    .addFields(
      { name: 'Wind', value: `${wind.speed} m/s`, inline: true },
      { name: '\u200B', value: '\u200B' },
    )
    .addFields(
      { name: 'Sunrise', value: `${sunrise.toUTCString().match(/\d+:\d+/)[0]}`, inline: true },
      { name: 'Sunset', value: `${sunset.toUTCString().match(/\d+:\d+/)[0]}`, inline: true },
    )
    .setColor('#8a00c2')
    .setTimestamp()
    .setFooter({ text: 'CreaBot' })

  return {
    embeds: [
      embed,
    ],
  }
}

const handleCurrent = async (req, res) => {
  const queryOpt = req.subCommand.options[0]
  const city = queryOpt.value

  const data = await getCurrentForecastEmbed(city)

  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data,
  })
}

const handleWeather = async (req, res) => {
  switch (req.subCommand.name) {
  case '24h':
    handle24h(req, res)
    break
  case 'current':
    handleCurrent(req, res)
    break
  default:
    return res.send({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: `${req.commandName} not yet implemented`,
      },
    })
  }
}

module.exports = {
  weather,
  forecastAndPopulate,
  checkInvalid,
  handleWeather,
}
