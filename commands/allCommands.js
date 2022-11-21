const { echo } = require('./echo')
const { route } = require('./route')
const { ping } = require('./ping')
const { pp } = require('./pp')
const { subscribe, unsubscribe } = require('./subscribe')
const { weather } = require('./weather')
const { challenge } = require('./challenge')
const { remindme } = require('./remindme')
const { esportal } = require('./esportal')

const commands = [
  echo,
  route,
  ping,
  pp,
  weather,
  subscribe,
  unsubscribe,
  challenge,
  remindme,
  esportal,
]

module.exports = commands
