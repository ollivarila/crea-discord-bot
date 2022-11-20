/* eslint-disable camelcase */
const {
  InteractionResponseType,
} = require('discord-interactions')
const {
  addPlayer, createLeaderboard, deleteLeaderboard, currentLeaderboard, removePlayer,
} = require('../commands/esportal')

const sendReply = (res, reply) => res.send({
  type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
  data: {
    content: reply,
  },
})

const handleCreate = async (req, res, options) => {
  const { data } = req.body
  const { guild_id } = data
  const channelId = options[0].value
  const reply = await createLeaderboard(guild_id, channelId)
  sendReply(res, reply)
}

const handleAdd = async (req, res, options) => {
  const { data } = req.body
  const { guild_id } = data
  const player = options[0].value
  const reply = await addPlayer(guild_id, player)
  sendReply(res, reply)
}

const handleCurrent = async (req, res) => {
  const { data } = req.body
  const { guild_id } = data
  const reply = await currentLeaderboard(guild_id)
  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      embeds: [
        reply,
      ],
    },
  })
}

const handleDelete = async (req, res) => {
  const { data } = req.body
  const { guild_id } = data
  const reply = await deleteLeaderboard(guild_id)
  sendReply(res, reply)
}

const handleRemove = async (req, res, options) => {
  const { data } = req.body
  const { guild_id } = data
  const player = options[0].value
  const reply = await removePlayer(guild_id, player)
  sendReply(res, reply)
}

const handleLeaderboard = async (req, res) => {
  const { options } = req.body.data.options[0]
  const { name } = options[0]
  switch (name) {
  case 'create':
    handleCreate(req, res, options[0].options)
    break
  case 'add':
    handleAdd(req, res, options[0].options)
    break
  case 'current':
    handleCurrent(req, res)
    break
  case 'delete':
    handleDelete(req, res)
    break
  case 'remove':
    handleRemove(req, res, options[0].options)
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

const handleEsportalInteraction = (req, res) => {
  const { options } = req.body.data
  // Subcommand name
  const { name } = options[0]
  switch (name) {
  case 'leaderboard':
    handleLeaderboard(req, res)
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
