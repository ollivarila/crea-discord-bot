const dotenv = require('dotenv')
const subDao = require('../dao/subscriberDao')
const { checkInvalid } = require('./weather')
const { info, error } = require('../utils/logger')
const { forecastAndPopulate } = require('./weather')
const { createDmChannel, sendMessage } = require('../utils/discordUtils')

dotenv.config()

const jobController = require('../controllers/jobController')

const subscribe = {
  type: 1,
  name: 'subscribe',
  description: 'Subscribe to weather forecast updates',
  options: [
    {
      type: 3,
      name: 'query',
      description: 'Names of cities separated by a comma i.e espoo, helsinki... ',
      required: 'true',
    },
    {
      type: 3,
      name: 'time',
      description: 'Time when the forecast is sent',
    },
    {
      type: 3,
      name: 'utc_offset',
      description: 'hours offset from UTC time, i.e -2 or +8',
    },
  ],
}

const parseUtcOffset = offset => {
  if (offset > 14 || offset < -12) {
    return false
  }
  return true
}

const parseCities = cities => {
  const parsed = cities.split(/,\s*/)
  return parsed
}

const verifyCities = async cities => {
  const unverified = []
  for await (const city of cities) {
    const invalid = await checkInvalid(city)
    if (invalid) {
      unverified.push(city)
    }
  }
  return unverified
}

const verifyTime = time => {
  if (time.includes('+') || time.includes('-')) {
    return false
  }

  const parsed = time.split(/:/)
  if (parsed.length === 1) {
    return false
  }

  const hours = parseInt(parsed[0], 10)
  const minutes = parseInt(parsed[1], 10)

  if ((!hours && hours !== 0) || (!minutes && minutes !== 0)) {
    return false
  }

  if (hours > 23 || minutes > 59 || hours < 0 || minutes < 0) {
    return false
  }
  return true
}

const parseAndVerifydata = async (userdata, callback) => {
  const {
    username, discordid, citiesCsv, time, utcOffset,
  } = userdata
  const badData = []
  // Verify that data is correct
  const parsedCities = parseCities(citiesCsv)
  const unverified = await verifyCities(parsedCities)
  if (unverified.length > 0) {
    badData.push(unverified)
  }

  if (!verifyTime(time)) {
    badData.push(time)
  }

  if (!parseUtcOffset(utcOffset)) {
    badData.push('Offset should be between -12 and 14')
  }

  if (badData.length > 0) {
    callback(badData)
    return null
  }

  // Create dm channel
  // CAN BE NULL FIX THIS
  const dmChannel = await createDmChannel(discordid)
    .catch(err => {
      error(err.message)
      throw new Error('Failed to create dm')
    })

  return {
    username,
    discordid,
    cities: citiesCsv,
    time: jobController.createCrontime(time),
    utcOffset,
    dmChannel,
  }
}

const handleWeatherUpdate = async data => {
  const { discordid } = data
  // Get subscriber
  const sub = await subDao.get(discordid)
  // Get forecast
  const forecastEmbed = await forecastAndPopulate(sub.cities.split(/,\s*/), sub.utcOffset)

  // Send embed as dm to user
  const endpoint = `/channels/${sub.dmChannel}/messages`
  info(`Sending forecast to ${endpoint} (${sub.username})`)

  const res = await sendMessage(sub.dmChannel, { embeds: [forecastEmbed] })

  if (res === null) {
    error('Error occurred while sending request to discord')
  }
}

const subscribeUser = async (userdata) => {
  try {
    // Parse and verify user data
    let badData = null
    const userObj = await parseAndVerifydata(userdata, data => {
      badData = data
    })

    if (badData) {
      let str = 'Subscription failed, reason: '
      badData.forEach(d => {
        str += `${d}, `
      })
      return str.substring(0, str.length - 2)
    }

    await subDao.create(userObj)
    jobController.createJob(userObj, handleWeatherUpdate)

    return 'Subscribed!'
  } catch (err) {
    error(err)
    return err.message
  }
}

const unsubscribeUser = async discordid => {
  const res = await subDao.remove(discordid)
  jobController.removeJob(discordid)

  if (!res) {
    return 'Subscription not found from database'
  }

  return 'Unsubscribed!'
}

const setUpSubscriptions = async () => {
  const subs = await subDao.getAll()
  subs.forEach(sub => {
    jobController.createJob(sub, handleWeatherUpdate)
  })
  info('Subscriptions set up')
}

const unsubscribe = {
  type: 1,
  name: 'unsubscribe',
  description: 'Unsubscribe to weather forecast updates',
}

module.exports = {
  subscribe,
  subscribeUser,
  unsubscribe,
  unsubscribeUser,
  handleWeatherUpdate,
  setUpSubscriptions,
}
