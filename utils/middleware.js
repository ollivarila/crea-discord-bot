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

    req.options = data.options
    // Subcommand stuff
    const { options } = data
    if (data.type === 2) {
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
