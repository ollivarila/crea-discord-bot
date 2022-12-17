const { InteractionResponseType } = require('discord-interactions')
const { ApplicationCommandOptionType, ApplicationCommandType } = require('discord.js')
const { capitalize, replyToInteraction } = require('../utils/misc')

const misc = {
  type: ApplicationCommandType.ChatInput,
  name: 'misc',
  description: 'Miscellaniuos commands',
  options: [
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'ping',
      description: 'Ping the bot',
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'pp',
      description: 'Find out how long your pp is',
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: 'user',
          description: 'Name of the user how is measured',
        },
      ],
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'echo',
      description: 'echo whatever you say',
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: 'message',
          description: 'message',
          required: 'true',
        },
      ],
    },
  ],
}

const getPP = (user) => {
  const MIN = 1
  const MAX = 12
  let ppString = `${user}'s pp: B=`
  const size = Math.floor((Math.random() * MAX) + MIN)
  for (let i = 0; i < size; i++) {
    ppString += '='
  }
  ppString += 'D'
  return ppString
}

const handleEcho = (req, res) => {
  const echo = req.subCommand.options[0].value
  replyToInteraction(req, res, { content: echo })
}

const handlePing = (req, res) => {
  replyToInteraction(req, res, { content: 'pong' })
}

const handlePP = (req, res) => {
  const { user } = req
  const { options } = req.subCommand
  let selection

  if (options[0]) {
    selection = capitalize(options[0].value)
  }

  const ppString = getPP(selection || user.username)

  replyToInteraction(req, res, { content: ppString })
}

const handleMisc = (req, res) => {
  const { name } = req.subCommand
  switch (name) {
  case 'echo':
    handleEcho(req, res)
    break
  case 'ping':
    handlePing(req, res)
    break
  case 'pp':
    handlePP(req, res)
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
  misc,
  getPP,
  handleMisc,
}
