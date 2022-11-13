const express = require('express')
require('express-async-errors')
const { VerifyDiscordRequest } = require('./utils.js')
const dotenv = require('dotenv')
const loggerMiddleware = require('./utils/loggerMiddleware.js')
const interactionRouter = require('./controllers/interactionRouter.js')

const mongoose = require('mongoose')
const Subscriber = require('./models/Subscriber')
const { MONGODB_URI } = require('./config.js')
const logger = require('./utils/logger')

dotenv.config()
const app = express()

console.log(process.env.NODE_ENV)

mongoose.connect(MONGODB_URI).then(() => {
    logger.info('Connected to MongoDB')
  }).catch(error => logger.error('Error connecting to MongoDB', error))

if(process.env.NODE_ENV === 'development'){
  Subscriber.deleteMany({})
    .then(() => console.log('cleared database'))
}

// Parse request body and verifies incoming requests using discord-interactions package
if(process.env.NODE_ENV !== 'test'){
  app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLICKEY) }));
} else {
  app.use(express.json())
}

app.use(loggerMiddleware)

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.use('/interactions', interactionRouter)

module.exports = app

