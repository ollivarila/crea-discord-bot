import axios from "axios"
import dotenv from 'dotenv'
import { EmbedBuilder } from 'discord.js'

dotenv.config()

const baseUrl = 'https://api.openweathermap.org/data/2.5/forecast?units=metric&lang=en&'

export const getForecast = async (city) => {
    const endpoint = `q=${city}&appid=${process.env.WEATHER_KEY}`
    const url = baseUrl + endpoint
    try {
      const res = await axios.get(url)
      return res.data.list
    } catch (e) {
      console.error('error with getForecasts', e)
      return null
    }

}

const parseDate = date => {
  return `${date.getDay()}.${date.getMonth()}`
}



export const getForecastString = (city, forecast) => {
  if(!forecast) { return 'Bad query' }

  const date = new Date(0)
  date.setUTCSeconds(forecast[0].dt)
  let str = '\`\`\`' + city + ' ennuste ' + parseDate(date) + '\n'

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
    const date = new Date(0)
    date.setUTCSeconds(fc.dt)
    console.log(fc.weather)

    const temp = `Klo. ${date.getHours()} Lämpötila: ${Math.round(fc.main.temp)} C ${emoji[fc.weather[0].description]}\n`
    str += temp
  }
  /*forecast.forEach(elem => {
    const date = new Date(0)
    date.setUTCSeconds(elem.dt)
    console.log('date', date)
    console.log('temp', elem.main.temp)
    console.log('weather obj', elem.weather);

  })
  */
  return str + '\`\`\`'
}

export const exampleEmbed = new EmbedBuilder()
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
    }
  ]
}

export default forecast