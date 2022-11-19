/* eslint-disable no-case-declarations */
const { Router } = require('express')
const {
  InteractionType,
  InteractionResponseType,
  MessageComponentTypes,
  ButtonStyleTypes,
} = require('discord-interactions')
const { getRoute } = require('../commands/route')
const { createUrl } = require('../commands/search')
const { forecastAndPopulate } = require('../commands/weather')
const { capitalize } = require('../utils/utils')
const { subscribeUser, unsubscribeUser } = require('../commands/subscribe')
const { getPP } = require('../commands/pp')
const { error } = require('../utils/logger')
const { getChallengeUrl, getChallengeEmbed } = require('../commands/challenge')
const Challenge = require('../models/Challenge')
const { discordRequest } = require('../utils/requests')
const { createReminder } = require('../commands/remindme')

async function handleBadQuery(req, res, message) {
  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: message,
    },
  })
}

async function handleChallenge(req, res) {
  const challengerid = req.body.member.user.id
  const challengedid = req.body.data.options[0].value
  const interactionid = req.body.data.id
  const challengeObj = {
    interactionid,
    challengerName: req.body.member.user.username,
    challengerid,
    challengedid,
    token: req.body.token,
  }
  const challenge = new Challenge(challengeObj)
  await challenge.save()

  setTimeout(() => {
    const endpoint = `/webhooks/${process.env.APPID}/${challenge.token}/messages/@original`
    challenge.remove()
    discordRequest(endpoint, { method: 'delete' })
  }, 15000)

  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: `<@${challengedid}> Chess challenge from <@${challengerid}>. Expires in 15 seconds`,
      components: [
        {
          type: MessageComponentTypes.ACTION_ROW,
          components: [
            {
              type: MessageComponentTypes.BUTTON,
              custom_id: `accept_button_${interactionid}`,
              label: 'Accept',
              style: ButtonStyleTypes.SUCCESS,
            },
            {
              type: MessageComponentTypes.BUTTON,
              custom_id: `decline_button_${interactionid}`,
              label: 'Decline',
              style: ButtonStyleTypes.DANGER,
            },
          ],
        },
      ],
    },
  })
}

async function handleSubscribe(req, res) {
  // Gather user data
  const { options } = req.body.data
  const { username } = req.body.member.user
  const discordid = req.body.member.user.id
  const citiesCsv = options[0].value
  let time = '8:00'
  let utcOffset = 0
  try {
    time = options[1].value
    utcOffset = options[2].value
  } catch (err) {
    error(err)
  }

  const userdata = {
    username,
    discordid,
    citiesCsv,
    time,
    utcOffset,
    token: req.body.data.token,
  }

  // Try to subscribe
  const message = await subscribeUser(userdata)

  // Respond with message
  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: message,
    },
  })
}

function handleEcho(req, res) {
  const echo = req.body.data.options[0].value
  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: echo,
    },
  })
}

async function handleRoute(req, res) {
  const { options } = req.body.data
  const route = await getRoute({
    start: options[0].value,
    end: options[1].value,
  })

  if (!route) {
    return handleBadQuery(req, res, 'Route not found')
  }

  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: route,
    },
  })
}

function handlePing(req, res) {
  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: 'pong',
    },
  })
}

function handlePP(req, res) {
  const user = req.body.member.user.username

  let selection
  if (req.body.data.options) {
    selection = capitalize(req.body.data.options[0].value)
  }

  const ppString = getPP(selection || user)

  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: ppString,
    },
  })
}

function handleSearch(req, res) {
  const query = req.body.data.options[0].value
  const url = createUrl(query)
  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: url,
    },
  })
}

async function handleWeather(req, res) {
  const [queryOpt, offsetOpt] = req.body.data.options
  const cities = queryOpt.value.split(/,\s*/)
  let utcOffset
  if (offsetOpt) {
    utcOffset = offsetOpt.value
  }

  const forecastEmbed = await forecastAndPopulate(cities, utcOffset)

  if (!forecastEmbed) {
    let queries = ''
    cities.forEach(c => {
      queries += `${c} `
    })
    queries = queries.trimEnd()
    return handleBadQuery(req, res, `Weather not found with queries: ${queries}`)
  }

  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      embeds: [
        forecastEmbed,
      ],
    },
  })
}

async function handleUnsubscribbe(req, res) {
  const discordid = req.body.member.user.id
  const reply = await unsubscribeUser(discordid)

  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: reply,
    },
  })
}

async function handleRemindme(req, res) {
  const discordid = req.body.member.user.id
  const time = req.body.data.options[0].value
  const message = req.body.data.options[1] ? req.body.data.options[1].value : undefined
  const reply = await createReminder(discordid, time, message)

  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: reply,
    },
  })
}

async function handleInteractions(req, res) {
  // Interaction type and data
  const { type } = req.body;

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = req.body.data;

    switch (name) {
    case 'echo':
      handleEcho(req, res)
      break
    case 'route':
      handleRoute(req, res)
      break
    case 'ping':
      handlePing(req, res)
      break
    case 'pp':
      handlePP(req, res)
      break
    case 'search':
      handleSearch(req, res)
      break
    case 'weather':
      handleWeather(req, res)
      break
    case 'subscribe':
      handleSubscribe(req, res)
      break
    case 'unsubscribe':
      handleUnsubscribbe(req, res)
      break
    case 'challenge':
      handleChallenge(req, res)
      break
    case 'remindme':
      handleRemindme(req, res)
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

  if (type === InteractionType.MESSAGE_COMPONENT) {
    const { name } = req.body.message.interaction
    switch (name) {
    case 'challenge':
      const componentId = req.body.data.custom_id
      const interactionid = componentId.substring(componentId.lastIndexOf('_') + 1, componentId.length)
      const challenge = await Challenge.findOne({ interactionid })
      if (!challenge) {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: 'did not find challenge',
          },
        })
      }
      const userWhoClicked = req.body.member.user.id
      if (challenge.challengedid !== userWhoClicked) {
        return handleBadQuery(req, res, `<@${req.body.member.user.id}> you cannot accept/decline this challenge`)
      }

      await challenge.remove()
      const endpoint = `/webhooks/${process.env.APPID}/${challenge.token}/messages/@original`
      await discordRequest(endpoint, { method: 'delete' })

      if (componentId.includes('accept')) {
        const challengeUrl = await getChallengeUrl()
        const embed = getChallengeEmbed(
          {
            player1: challenge.challengerName,
            player2: req.body.member.user.username,
            url: challengeUrl,
          },
        )
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            embeds: [
              embed,
            ],
          },
        })
      }
      return res.send({
        type: InteractionResponseType.DEFERRED_UPDATE_MESSAGE,
      })

    default:
      error(`${name} not implemented`)
      break
    }
  }
}

const interactionRouter = Router()
interactionRouter.post('/', handleInteractions)

module.exports = interactionRouter
