const app = require('./app')
const http = require('http')
const config = require('./config')
const { info } = require('./utils/logger')
const { HasGuildCommands } = require('./commands.js')
const dotenv = require('dotenv')
const commands = require('./commands/allCommands.js')
dotenv.config()

const server = http.createServer(app)

server.listen(config.PORT, () => {
  info(`Server running on ${config.PORT}`)
  HasGuildCommands(process.env.APPID, process.env.GUILDID, commands);
})