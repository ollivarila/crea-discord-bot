const { ApplicationCommandOptionType } = require('discord.js')
const { info } = require('./logger')
/* eslint-disable camelcase */

const interactionExtractor = (req, res, next) => {
  if (req.body) {
    req.iType = req.body.type
    if (req.body.type === 1) {
      next()
      return
    }
    const { data, guild_id, id, member } = req.body

    req.guildId = guild_id
    req.interactionId = id
    req.user = member.user
    req.discordId = member.user.id
    req.commandName = data.name
    req.int = data

    console.log(req.user)
    const { options } = data

    if (!options) {
      next()
      return
    }
    req.options = options

    // Subcommand stuff
    if (
      options &&
      options[0].type === ApplicationCommandOptionType.SubcommandGroup
    ) {
      const subCommand = options[0]
      const subSubCommand = subCommand.options[0]

      req.subCommand = subCommand
      if (subSubCommand) {
        req.subSubCommand = subSubCommand
      }
    }

    if (
      options &&
      options[0].type === ApplicationCommandOptionType.Subcommand
    ) {
      const subCommand = options[0]
      req.subCommand = subCommand
    }
  }
  next()
}

const requestLogger = (req, res, next) => {
  if (req.path !== '/health') {
    info(`new request, method: ${req.method} path: ${req.path}`)
  }
  next()
}

const interactionLogger = (req, res, next) => {
  if (req.iType !== 1) {
    info(`user: ${req.user.username} used: /${req.commandName}`)
  }
  next()
}

module.exports = {
  interactionExtractor,
  requestLogger,
  interactionLogger,
}
