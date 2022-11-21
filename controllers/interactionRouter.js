/* eslint-disable no-case-declarations */
const { Router } = require('express')
const {
  InteractionType,
  InteractionResponseType,
  MessageComponentTypes,
  ButtonStyleTypes,
} = require('discord-interactions')
const { getRoute } = require('../commands/route')
const { forecastAndPopulate } = require('../commands/weather')
const { capitalize } = require('../utils/misc')
const { subscribeUser, unsubscribeUser } = require('../commands/subscribe')
const { getPP } = require('../commands/pp')
const { error } = require('../utils/logger')
const { getChallengeUrl, getChallengeEmbed } = require('../commands/challenge')
const Challenge = require('../models/Challenge')
const { discordRequest } = require('../utils/requests')
const { createReminder } = require('../commands/remindme')
const { handleEsportalInteraction } = require('./esportalInteraction')

async function handleBadQuery(req, res, message) {
  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: message,
    },
  })
}

async function handleChallenge(req, res) {
  const challengerid = req.user.id
  const challengedid = req.options[0].value
  const interactionid = req.interactionId
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
  const { options } = req
  const { username } = req.user
  const discordid = req.user.id
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
  const echo = req.options[0].value
  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: echo,
    },
  })
}

async function handleRoute(req, res) {
  const { options } = req
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
  const { user, options } = req
  let selection
  if (options) {
    selection = capitalize(options[0].value)
  }

  const ppString = getPP(selection || user.username)

  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: ppString,
    },
  })
}

async function handleWeather(req, res) {
  const [queryOpt, offsetOpt] = req.options
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
  const discordid = req.user.id
  const reply = await unsubscribeUser(discordid)

  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: reply,
    },
  })
}

async function handleRemindme(req, res) {
  const discordid = req.user.id
  const { options } = req
  const time = options[0].value
  const message = options[1] ? options[1].value : undefined
  const reply = await createReminder(discordid, time, message)

  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: reply,
    },
  })
}

async function handleInteractions(req, res) {
  // Verification requests
  if (req.iType === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  // Slash commands
  if (req.iType === InteractionType.APPLICATION_COMMAND) {
    switch (req.commandName) {
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
    case 'esportal':
      handleEsportalInteraction(req, res)
      break
    default:
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `${req.commandName} not yet implemented`,
        },
      })
    }
  }

  // Message components
  if (req.iType === InteractionType.MESSAGE_COMPONENT) {
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
      const userWhoClicked = req.user.id
      if (challenge.challengedid !== userWhoClicked) {
        return handleBadQuery(req, res, `<@${userWhoClicked}> you cannot accept/decline this challenge`)
      }

      await challenge.remove()
      const endpoint = `/webhooks/${process.env.APPID}/${challenge.token}/messages/@original`
      await discordRequest(endpoint, { method: 'delete' })

      if (componentId.includes('accept')) {
        const challengeUrl = await getChallengeUrl()
        const embed = getChallengeEmbed(
          {
            player1: challenge.challengerName,
            player2: userWhoClicked,
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
