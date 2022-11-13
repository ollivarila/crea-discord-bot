const subDao = require('../dao/subscriberDao')
const { checkInvalid, getTimezone } = require('./weather')

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

const parseTimezone = async city => {
  const timezone = await getTimezone(city)
  if(!timezone){
    return null
  }
  return timezone
}

const parseCities = cities => {
  const parsed = cities.split(/,\s*/)
  return parsed
}

const verifyCities = cities => {
  const unverified  = []
  cities.forEach(async c => {
    const invalid = await checkInvalid(c)
    if(invalid){
      unverified.push(c)
    }
  })
  return unverified
}

const parseAndVerifydata = async (userdata, callback) => {
  const { username, discordid, citiesCsv, time, timezoneNumber } = userdata
  const parsedCities = parseCities(citiesCsv)
  const getThisTimezone = parsedCities[timezoneNumber - 1]

  const timezone = await parseTimezone(getThisTimezone)

  const unverified = verifyCities(parsedCities)

  if(unverified.length > 0){
    return callback(unverified)
  }

  return {
    username,
    discordid,
    cities: citiesCsv,
    time: parseTime(time),
    timezone
  }
}

const subscribeUser = async (userdata, callback) => {
  const userObj = await parseAndVerifydata(userdata, callback)
  if(!userObj) { return null }
  const res = await subDao.create(userObj)

  if(!res){
    console.error('Subscription failed')
    return 'Subscription failed'
  }

  return 'Subscribed!'
}


module.exports = {
  subscribe,
  subscribeUser
}