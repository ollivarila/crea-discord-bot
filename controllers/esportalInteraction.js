/* eslint-disable camelcase */
const {
  InteractionResponseType,
} = require('discord-interactions')
const {
  addPlayer, createLeaderboard, deleteLeaderboard, currentLeaderboard, removePlayer, getStatsEmbed,
} = require('../commands/esportal')

const sendReply = (res, reply) => res.send({
  type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
  data: {
    content: reply,
  },
})

const handleCreate = async (req, res) => {
  const { guildId } = req
  const channelId = req.subSubCommand.options[0].value
  const reply = await createLeaderboard(guildId, channelId)
  sendReply(res, reply)
}

const handleAdd = async (req, res) => {
  const { guildId } = req
  const player = req.subSubCommand.options[0].value
  const reply = await addPlayer(guildId, player)
  sendReply(res, reply)
}

const handleCurrent = async (req, res) => {
  const { guildId } = req
  const data = await currentLeaderboard(guildId)
  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data,
  })
}

const handleDelete = async (req, res) => {
  const { guildId } = req
  const reply = await deleteLeaderboard(guildId)
  sendReply(res, reply)
}

const handleRemove = async (req, res) => {
  const { guildId } = req
  const player = req.subSubCommand.options[0].value
  const reply = await removePlayer(guildId, player)
  sendReply(res, reply)
}

const handleLeaderboard = async (req, res) => {
  const { name } = req.subSubCommand
  switch (name) {
  case 'create':
    handleCreate(req, res)
    break
  case 'add':
    handleAdd(req, res)
    break
  case 'current':
    handleCurrent(req, res)
    break
  case 'delete':
    handleDelete(req, res)
    break
  case 'remove':
    handleRemove(req, res)
    break
  default:
    return res.send({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: `${name} not yet implemented`,
      },
    })
  }
}

const handleStats = async (req, res) => {
  const player = req.subCommand.options[0].value
  const data = await getStatsEmbed(player)
  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data,
  })
}

const handleEsportalInteraction = (req, res) => {
  // Subcommand name
  const { name } = req.subCommand
  switch (name) {
  case 'leaderboard':
    handleLeaderboard(req, res)
    break
  case 'stats':
    handleStats(req, res)
    break
  default:
    return res.send({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: `${name} not yet implemented`,
      },
    })
  }
}

module.exports = {
  handleEsportalInteraction,
}
