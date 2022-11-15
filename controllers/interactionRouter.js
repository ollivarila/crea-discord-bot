const { Router } = require('express')
const {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} = require('discord-interactions')
const { getRoute } = require('../commands/route.js')
const { createUrl } = require('../commands/search.js')
const { forecastAndPopulate } = require('../commands/weather.js')
const { capitalize } = require('../utils')
const { subscribeUser } = require('../commands/subscribe')
const { getPP } = require('../commands/pp')

const interactionRouter = Router()
interactionRouter.post('/', handleInteractions)

async function handleInteractions (req, res) {
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

    switch(name){
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
    default:
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `${name} not yet implemented`
        }
      })
    }
  } 
}

async function handleSubscribe(req, res){

  //Gather user data
  const options = req.body.data.options
  const username = req.body.member.user.username
  const discordid = req.body.member.user.id
  const citiesCsv = options[0].value
  let time = '8:00'
  let utcOffset = 0
  try {
    time = options[1].value
    utcOffset = options[2].value
  } catch (error) {
    
  }

  const userdata = {
    username,
    discordid,
    citiesCsv,
    time,
    utcOffset
  }

  //Try to subscribe
  const message = await subscribeUser(userdata)

  //Respond with message
  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: message
    }
  })

}

function handleEcho(req, res){
  const echo = req.body.data.options[0].value
  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: echo
    }
  })
}

async function handleRoute(req, res){
  const options = req.body.data.options
  const route = await getRoute({
    start: options[0].value,
    end: options[1].value
  })

  if(!route) {
    return handleBadQuery(req, res, 'Route not found')
  }

  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: route
    }
  })
}

function handlePing(req, res){
  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: 'pong'
    }
  })
}

function handlePP(req, res){
  const user = req.body.member.user.username

  let selection
  if(req.body.data.options){
    selection = capitalize(req.body.data.options[0].value)
  }
  
  const ppString = getPP(selection ? selection : user)

  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: ppString
    }
  })
}

function handleSearch(req, res) {
  const query = req.body.data.options[0].value
  const url = createUrl(query)
  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: url
    }
  })
}

async function handleWeather(req, res){
  const cities = []

  req.body.data.options.forEach(e => cities.push(e.value))

  const forecastEmbed = await forecastAndPopulate(cities)

  if(!forecastEmbed){
    let queries = ''
    cities.forEach(c => queries += `${c} `)
    queries = queries.trimEnd()
    return handleBadQuery(req, res, `Weather not found with queries: ${queries}`)
  }

  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      embeds: [
        forecastEmbed
      ]          
    }
  })
}

async function handleBadQuery(req, res, message) {
  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: message
    }
  })
}

module.exports = interactionRouter