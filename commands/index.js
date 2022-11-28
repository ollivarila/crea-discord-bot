const { route } = require('./route')
const { subscribe, unsubscribe } = require('./subscribe')
const { weather } = require('./weather')
const { challenge } = require('./challenge')
const { remindme } = require('./remindme')
const { esportal } = require('./esportal')
const { misc } = require('./misc')

const commands = [
  misc,
  route,
  weather,
  subscribe,
  unsubscribe,
  challenge,
  remindme,
  esportal,
]

module.exports = commands
