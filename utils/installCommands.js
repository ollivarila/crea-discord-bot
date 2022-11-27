const dotenv = require('dotenv')
const { hasGuildCommands } = require('./discordUtils')
const commands = require('../commands')

dotenv.config()

hasGuildCommands(process.env.APPID, process.env.GUILDID, commands)
