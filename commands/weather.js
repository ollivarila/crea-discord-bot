const {
  EmbedBuilder, ApplicationCommandOptionType, ApplicationCommandType,
} = require('discord.js')
const { InteractionResponseType } = require('discord-interactions')
const { capitalize } = require('../utils/misc')
const { request } = require('../utils/requests')

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
  return res ? res.data.list : null
}

const adjustForTimezone = (date, offset) => {
  const timeOffsetInMs = (offset * 60) * 60000
  date.setTime(date.getTime() + timeOffsetInMs)
  return date
}

const parseDate = (date) => date.toLocaleString('fi-FI', { dateStyle: 'short' })

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

  return `Klo. ${date.getUTCHours()} Lämpötila: ${Math.round(fc.main.temp)} C ${emoji}\n`
}

const parseForecast = (city, forecast, offset) => {
  if (!forecast) { return null }

  let date = new Date(0)
  date.setUTCSeconds(forecast[0].dt)

  if (offset > 0) {
    date = adjustForTimezone(date, offset)
  }

  const parsedCity = capitalize(city)

  let str = ''

  for (let i = 0; i < 8; i++) {
    const fc = forecast[i]
    let dateFc = new Date(0)
    dateFc.setUTCSeconds(fc.dt)

    if (offset > 0) {
      dateFc = adjustForTimezone(dateFc, offset)
    }

    const temp = getForecastLine(fc, dateFc)
    str += temp
  }

  return {
    city: parsedCity,
    dateStr: parseDate(date),
    str,
  }
}

const get24hEmbed = data => {
  const weatherEmbed = new EmbedBuilder()
    .setColor(0x8a00c2)
    .setTitle('Sääennusteet')
    .setDescription('Jotain tietoja')

  data.forEach(forecast => {
    const { city, dateStr, str } = forecast
    weatherEmbed
      .addFields(
        { name: `${city} sääennuste ${dateStr}`, value: str },
      )
  })
  weatherEmbed.setFooter({ text: 'CreaBot' })

  return weatherEmbed
}

/*
const exampleEmbed = new EmbedBuilder()
.setColor(0x0099FF)
.setTitle('Some title')
.setURL('https://discord.js.org/')
.setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
.setDescription('Some description here')
.setThumbnail('https://i.imgur.com/AfFp7pu.png')
.addFields(
  { name: 'Regular field title', value: 'Some value here' },
  { name: '\u200B', value: '\u200B' },
  { name: 'Inline field title', value: 'Some value here', inline: true },
  { name: 'Inline field title', value: 'Some value here', inline: true },
)
.addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
.setImage('https://i.imgur.com/AfFp7pu.png')
.setTimestamp()
.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
*/

const forecastAndPopulate = async (cities, offset = 0) => {
  const forecasts = []

  // Get forecasts
  for await (const city of cities) {
    const forecast = await getForecast(city)

    if (!forecast) { return null }

    forecasts.push({
      city,
      forecast,
    })
  }

  const parsedForecasts = []
  // Build forecast strings
  for (const fc of forecasts) {
    const { city, forecast } = fc
    const parsedForecast = parseForecast(city, forecast, offset)
    if (parsedForecast) { parsedForecasts.push(parsedForecast) }
  }

  // Build embed
  return get24hEmbed(parsedForecasts)
}

const checkInvalid = async city => {
  const forecast = await getForecast(city)
  if (!forecast) { return true }
  return false
}
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
    {
      type: 4,
      name: 'utcoffset',
      description: 'utc offset',
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

const handle24h = async (req, res) => {
  const [queryOpt, offsetOpt] = req.subCommand.options
  const cities = queryOpt.value.split(/,\s*/)
  let utcOffset
  if (offsetOpt) {
    utcOffset = offsetOpt.value
  }

  const forecastEmbed = await forecastAndPopulate(cities, utcOffset)

  if (!forecastEmbed) {
    let queries = ''
    cities.forEach(c => {
      queries += `${c} `
    })
    queries = queries.trimEnd()
    res.send({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: `Weather not found with queries: ${queries}`,
      },
    })
    return
  }

  res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      embeds: [
        forecastEmbed,
      ],
    },
  })
}

const getCurrentForecastEmbed = async (city) => {
  const forecast = await getCurrentWeather(city)
  if (!forecast) return null

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
      { name: '\u200B', value: '\u200B' },
    )
    .setColor('#8a00c2')
    .setTimestamp()
    .setFooter({ text: 'CreaBot' })

  return embed
}

const handleCurrent = async (req, res) => {
  const queryOpt = req.subCommand.options[0]
  const city = queryOpt.value

  const embed = await getCurrentForecastEmbed(city)

  if (!embed) {
    res.send({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: `Weather not found with query: ${queryOpt.value}`,
      },
    })
    return
  }

  res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      embeds: [
        embed,
      ],
    },
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
