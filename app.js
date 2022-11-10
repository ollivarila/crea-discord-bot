import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';
import { VerifyDiscordRequest, } from './utils.js';
import {
  HasGuildCommands,
} from './commands.js';

import PING_COMMAND from './commands/ping.js';
import ECHO_COMMAND from './commands/echo.js';
import search, { createUrl } from './commands/search.js';
import ROUTE_COMMAND, { getRoute } from './commands/hslroute.js';
import PP_COMMAND from './commands/pp.js';
import GAY_COMMAND, { getAnswer } from './commands/gay.js';
import forecast, { forecastAndPopulate } from './commands/weather.js';


import { capitalize } from './utils.js';

import dotenv from 'dotenv'
dotenv.config()

import logger from './utils/logger.js';

const app = express();

const PORT = 3001

// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLICKEY) }));

app.use(logger)

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post('/interactions', async function (req, res) {
  // Interaction type and data
  const { type, id, data } = req.body;

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
    const { name } = data;

    if(name === 'ping'){
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: 'pong'
        }
      })
    }

    if(name === 'echo'){
      console.log(data)
      const echo = data.options[0].value
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: echo
        }
      })
    }

    if(name === 'search'){
      const query = data.options[0].value
      const url = createUrl(query)
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: url
        }
      })
    }
    if(name === 'route'){
      const route = await getRoute({
        start: data.options[0].value,
        end: data.options[1].value
      })
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: route
        }
      })
    }

    if(name === 'pp'){
      const MIN = 1
      const MAX = 12

      const user = req.body.member.user.username
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

    if(name === 'gay'){
      const user = req.body.member.user.username
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: getAnswer(user)
        }
      })
    }

    if(name === 'weather') {
      const cities = []

      data.options.forEach(e => cities.push(e.value))

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

  }
});

app.listen(PORT, async () => {
  console.log('Listening on port', PORT);
  // Check if guild commands from commands.js are installed (if not, install them)
  HasGuildCommands(process.env.APPID, process.env.GUILDID, [
    PING_COMMAND,
    ECHO_COMMAND,
    search,
    ROUTE_COMMAND,
    PP_COMMAND,
    GAY_COMMAND,
    forecast
  ]);
});

/*

const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

await lib.discord.channels['@0.3.2'].messages.create({
  "channel_id": `${context.params.event.channel_id}`,
  "content": `test`,
  "tts": false,
  "embeds": [
    {
      "type": "rich",
      "title": `test`,
      "description": "",
      "color": 0x00FFFF
    }
  ]
});

*/
