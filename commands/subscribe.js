import mongoose from "mongoose"
import Subscriber from "../models/Subscriber.js"

const subscribe = {
  type: 1,
  name: 'subscribe',
  description: 'Subscribe to weather forecast updates',
  options: [
    {
      type: 3,
      name: 'query',
      description: 'Names of cities separated by a comma i.e espoo, helsinki... ',
      required: true
    },
    {
      type: 3,
      name: 'time',
      description: 'Time when the forecast is sent',
    },
    {
      type: 3,
      name: 'timezone',
      description: 'timezone',
    }
  ]
}

const parseTime = time => {
  const parts = time.split(/:/)
  return parts[0].concat(parts[1]) 
}

const parseTimezone = timezone => {
  //weather api returns timezone use that
}

const parseCities = cities => {
  return cities.split(/,\s*/)
}

const parseAndVerifydata = userdata => {
  const { username, discordid, cities, time, timezone } = userdata
  const cityJson = JSON.stringify({ ...parseCities(cities) })
  const parsedData = {
    username,
    discordid,
    cities: cityJson,
    time: parseTime(time),
    timezone: parseTimezone(timezone)
  }

  
}

const createUser = async userObj => {

}

export const subscribeUser = async userdata => {
  const userObj = parseUserdata(userdata)
  if(!userObj) { return null }
}


export default subscribe