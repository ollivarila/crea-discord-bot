const { echo } = require('./echo')
const { route } = require('./route')
const { ping } = require('./ping')
const { pp } = require('./pp')
const { search } = require('./search')
const { subscribe } = require('./subscribe')
const { weather } = require('./weather')

const commands = [
  echo,
  route,
  ping,
  pp,
  search,
  weather,
  subscribe,
]

module.exports = commands
