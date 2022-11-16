const http = require('http')
const dotenv = require('dotenv')
const app = require('./app')
const config = require('./config')
const { info } = require('./utils/logger')
const { HasGuildCommands } = require('./commands')
const commands = require('./commands/allCommands')

dotenv.config()

const server = http.createServer(app)

server.listen(config.PORT, () => {
  info(`Server running on ${config.PORT}`)
  HasGuildCommands(process.env.APPID, process.env.GUILDID, commands);
})
