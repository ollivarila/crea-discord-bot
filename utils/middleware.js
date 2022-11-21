/* eslint-disable camelcase */
const interactionExtractor = (req, res, next) => {
  if (req.body) {
    req.iType = req.body.type
    if (req.body.type === 1) {
      next()
      return
    }

    const {
      data, guild_id, id, member,
    } = req.body

    req.guildId = guild_id
    req.interactionId = id
    req.user = member.user
    req.commandName = data.name
    req.int = data
    const { options } = data

    if (!options) {
      next()
      return
    }
    req.options = options

    // Subcommand stuff
    if (options && options[0].type === 2) {
      const subCommand = options[0]
      const subSubCommand = subCommand.options[0]

      req.subCommand = subCommand
      if (subSubCommand) {
        req.subSubCommand = subSubCommand
      }
    }
  }
  next()
}

module.exports = {
  interactionExtractor,
}
