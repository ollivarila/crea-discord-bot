import axios from "axios"
import dotenv from 'dotenv'
import { EmbedBuilder } from 'discord.js'
import { capitalize } from '../utils.js'

dotenv.config()

const baseUrl = 'https://api.openweathermap.org/data/2.5/forecast?units=metric&lang=en&'

const getForecast = async (city) => {
    const endpoint = `q=${city}&appid=${process.env.WEATHERTOKEN}`
    const url = baseUrl + endpoint
    try {
      const res = await axios.get(url)
      return res.data.list
    } catch (e) {
      console.error('error with getForecasts', e.response.data)
      return null
    }

}

const parseDate = date => {
  return `${date.getDay()}.${date.getMonth()}`
}

const parseForecast = (city, forecast) => {
  if(!forecast) { return null }

  const date = new Date(0)
  date.setUTCSeconds(forecast[0].dt)

  const parsedCity = capitalize(city)

  let str = ''

  const emoji = {
    'overcast clouds': '☁️',
    'light rain': '☁️💧',
    'broken clouds': '⛅',
    'scattered clouds': '⛅',
    'few clouds': '⛅',
    'shower rain': '🌧',
    'rain': '☔',
    'thunderstorm': '⛈⚡',
    'snow': '🌨',
    'mist': '🌫',
    'clear sky': '🌞'
  }

  for(let i = 0; i < 8; i++){
    const fc = forecast[i]
    const dateFc = new Date(0)
    dateFc.setUTCSeconds(fc.dt)

    const temp = `Klo. ${dateFc.getHours()} Lämpötila: ${Math.round(fc.main.temp)} C ${emoji[fc.weather[0].description]}\n`
    str += temp
  }

  return {
    city: parsedCity,
    dateStr: parseDate(date),
    str: str
  }
}

const getEmbed = data => {
  const weatherEmbed = new EmbedBuilder()
    .setTitle('Sääennusteet')
    .setDescription('Jotain tietoja')

  data.forEach(forecast => {
    const { city, dateStr, str } = forecast
    weatherEmbed
      .addFields(
        { name: `${city} sääennuste ${dateStr}`, value: str }
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

export const forecastAndPopulate = async cities => {
  const forecasts = []

  //Get forecasts
  for(const city of cities){
    const forecast = await getForecast(city)
    forecasts.push({
      city,
      forecast
    })
  }

  const parsedForecasts = []
  //Build forecast strings
  for(const fc of forecasts){
    const { city, forecast } = fc
    const parsedForecast = parseForecast(city, forecast)
    if(parsedForecast) { parsedForecasts.push(parsedForecast) }
  }

  //Build embed
  return getEmbed(parsedForecasts)
}

const forecast = {
  type: 1,
  name: 'weather',
  description: 'get weather forecast for a city',
  options: [
    {
      type: 3,
      name: 'query',
      description: 'name of the city',
      required: true
    },
    {
      type: 3,
      name: 'query2',
      description: 'name of the city',
    },
    {
      type: 3,
      name: 'query3',
      description: 'name of the city',
    }
  ]
}

export default forecast