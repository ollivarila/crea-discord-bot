/* eslint-disable prefer-destructuring */
/* eslint-disable no-const-assign */
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
  const { message, channelid } = data
  // Send message to dm
  sendDm(channelid, { content: message })
}
// 1 hours 1 minute 20 seconds
const parseTime = time => {
  console.log(time)
  let hours = 0
  let minutes = 0
  let seconds = 0

  try {
    if (time.includes('sec')) {
      const parsed = time.match(/\d+\s*sec/)[0]
      seconds = parsed.match(/\d+/)[0]
    }

    if (time.includes('min')) {
      const parsed = time.match(/\d+\s*min/)[0]
      minutes = parsed.match(/\d+/)[0]
    }

    if (time.includes('hour')) {
      const parsed = time.match(/\d+\s*hour/)[0]
      hours = parsed.match(/\d+/)[0]
    }
  } catch (error) {
    throw new Error('Error parsing time')
  }

  console.log(hours, minutes, seconds)

  const MAX_VALUE = 24 * 60 * 60 * 1000 // 24 hours
  const ms = timeToMs(hours, minutes, seconds)

  if (ms > MAX_VALUE) {
    throw new Error('Time too large')
  }

  return ms
}

const createReminder = async (discordid, time, message = 'Hey I\'m here to remind you') => {
  try {
    // Create dm channel
    const channelid = await createDmChannel(discordid)

    const ms = parseTime(time)
    // Set timeout for message
    setTimeout(() => { handleReminder({ message, channelid }) }, ms)

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
