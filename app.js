import express from 'express'
import { VerifyDiscordRequest, } from './utils.js'
import { HasGuildCommands } from './commands.js'
import dotenv from 'dotenv'
import loggerMiddleware from './utils/loggerMiddleware.js'
import requestMiddleware from './utils/requestMiddleware.js'
import interactionRouter from './controllers/interactionRouter.js'
import commands from './commands/allCommands.js'
import mongoose from 'mongoose'
import logger from './utils/logger.js'

dotenv.config()

const app = express()

const PORT = 3001

mongoose.connect(process.env.MONGODB_URI)
  .then(() =>{
    logger.info('Connected to MongoDB')
  })
  .catch(err => logger.error('Error connecting to MongoDB', err))

// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLICKEY) }));
app.use(loggerMiddleware)
app.use(requestMiddleware)

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.use('/interactions', interactionRouter)

app.listen(PORT, async () => {
  console.log('Listening on port', PORT);
  // Check if guild commands are installed (if not, install them)
  HasGuildCommands(process.env.APPID, process.env.GUILDID, commands);
})