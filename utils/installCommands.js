const dotenv = require('dotenv')
const { HasGuildCommands } = require('../commands')
const commands = require('../commands/allCommands')

dotenv.config()

HasGuildCommands(process.env.APPID, process.env.GUILDID, commands)
