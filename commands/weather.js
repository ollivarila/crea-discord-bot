const { EmbedBuilder } = require('discord.js')
const { capitalize } = require('../utils')
const { request } = require('../utils/requests')

const baseUrl = 'https://api.openweathermap.org/data/2.5/forecast?units=metric&lang=en&'

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

const parseDate = (date) => {
  const day = date.getUTCDate()
  const month = date.getUTCMonth()

  return `${day}.${month}`
}

const getForecastLine = (fc, date) => {
  const emoji = {
    'overcast clouds': '☁️',
    'light rain': '☁️💧',
    'broken clouds': '⛅',
    'scattered clouds': '⛅',
    'few clouds': '⛅',
    'shower rain': '🌧',
    rain: '☔',
    thunderstorm: '⛈⚡',
    snow: '🌨',
    mist: '🌫',
    'clear sky': '🌞',
  }
  return `Klo. ${date.getUTCHours()} Lämpötila: ${Math.round(fc.main.temp)} C ${emoji[fc.weather[0].description]}\n`
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

const getEmbed = data => {
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
  weatherEmbed.setFooter({ text: 'GreatestBotEver' })

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
  for (const city of cities) {
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
  return getEmbed(parsedForecasts)
}

const checkInvalid = async city => {
  const forecast = await getForecast(city)
  if (!forecast) { return true }
  return false
}

const weather = {
  type: 1,
  name: 'weather',
  description: 'get weather forecast for a city',
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

module.exports = {
  weather,
  forecastAndPopulate,
  checkInvalid,
}
