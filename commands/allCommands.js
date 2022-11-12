const {echo} = require("./echo.js")
const { gay } = require("./gay.js")
const {route} = require("./route.js")
const {ping} = require("./ping.js")
const {pp} = require("./pp.js")
const {search} = require("./search.js")
const {subscribe} = require("./subscribe.js")
const {weather} = require("./weather.js")

const commands = [
  echo,
  gay,
  route,
  ping,
  pp,
  search,
  weather,
  subscribe
]

module.exports = commands