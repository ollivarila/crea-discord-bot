const jobController = require('../controllers/jobController')
const { createDmChannel, sendDm } = require('../utils/discordUtils')

const remindme = {
  type: 1,
  name: 'remindme',
  description: 'I will remind you after a specified time',
  options: [
    {
      type: 3,
      name: 'time',
      description: 'I.e 1 hour and 20 minutes',
      required: true,
    },
    {
      type: 3,
      name: 'message',
      description: 'Message that will be sent',
    },
  ],
}

const timeToMs = (hours, minutes, seconds) => {
  const sec = ((hours * 60) + minutes) * 60 + seconds
  const ms = sec * 1000
  return ms
}

const handleReminder = async data => {
  const { message, channelid, discordid } = data
  // Send message to dm
  sendDm(channelid, { content: message })
  jobController.removeJob(discordid)
}
// 1 hours 1 minute 20 seconds
const parseTime = time => {
  const now = new Date(Date.now())
  const parsed = time.split(' ')
  let hours = 0
  let minutes = 0
  let seconds = 0
  parsed.forEach((e, i) => {
    if (e.includes('hour')) {
      hours = parsed[i - 1]
    }
    if (e.includes('min')) {
      minutes = parsed[i - 1]
    }
    if (e.includes('sec')) {
      seconds = parsed[i - 1]
    }
  })
  if (hours && minutes && seconds) {
    throw new Error('Something went wrong parsing time')
  }

  const ms = timeToMs(hours, minutes, seconds)
  now.setTime(now.getTime() + ms)
  return `${now.getSeconds()} ${now.getMinutes()} ${now.getHours()} * * *`
}

const createReminder = async (discordid, interactionid, time, message = 'Hey I\'m here to remind you') => {
  try {
    // Create dm channel
    const channelid = createDmChannel(discordid)

    // Parse time
    const parsedTime = parseTime(time)
    // Create job
    jobController.createJob({
      time: parsedTime,
      utcOffset: null,
      id: interactionid,
      message,
      channelid,
    }, handleReminder)
    // Return appropriate message
    return `I will remind you in ${time}`
  } catch (err) {
    return err.message
  }
}

module.exports = {
  remindme,
  createReminder,
  parseTime,
}
