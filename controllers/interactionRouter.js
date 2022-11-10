import { Router } from "express";
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';
import { getAnswer } from '../commands/gay.js'
import { getRoute } from '../commands/hslroute.js'
import { createUrl } from '../commands/search.js'
import { forecastAndPopulate } from '../commands/weather.js'


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
    case 'gay':
      handleGay(req, res)
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

function handleEcho(req, res){
  const echo = req.interaction.options[0].value
  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: echo
    }
  })
}

function handleGay(req, res){
  const user = req.interaction.user.username
  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: getAnswer(user)
    }
  })
}

async function handleRoute(req, res){
  const route = await getRoute({
    start: req.interaction.options[0].value,
    end: req.interaction.options[1].value
  })
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
  const MIN = 1
  const MAX = 12

  const user = req.interaction.user.username
  let selection
  if(data.options){
    selection = capitalize(data.options[0].value)
  }
  
  let ppString = `${selection ? selection : user}'s pp: B` 
  const size = Math.floor((Math.random() * MAX) + MIN)
  for(let i = 0; i < size; i++){
    ppString += '='
  }
  ppString += 'D'


  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: ppString
    }
  })
}

function handleSearch(req, res) {
  const query = req.interaction.options[0].value
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

  req.interaction.options.forEach(e => cities.push(e.value))

  const forecastEmbed = await forecastAndPopulate(cities)

  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      embeds: [
        forecastEmbed
      ]          
    }
  })
}

export default interactionRouter