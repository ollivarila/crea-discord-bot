/* eslint-disable camelcase */
const interactionExtractor = (req, res, next) => {
  if (req.body) {
    const {
      data, guild_id, id, member, type,
    } = req.body

    req.guildId = guild_id
    req.interactionId = id
    req.user = member.user
    req.iType = type
    req.int = data
  }
  next()
}

module.exports = {
  interactionExtractor,
}
