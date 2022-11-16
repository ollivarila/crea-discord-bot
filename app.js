const express = require('express')
require('express-async-errors')
const mongoose = require('mongoose')
const { VerifyDiscordRequest } = require('./utils')
const loggerMiddleware = require('./utils/loggerMiddleware')
const interactionRouter = require('./controllers/interactionRouter')

const Subscriber = require('./models/Subscriber')
const { MONGODB_URI } = require('./config')
const { info, error } = require('./utils/logger')

const app = express()

mongoose.connect(MONGODB_URI).then(() => {
  info('Connected to MongoDB')
}).catch(err => error('Error connecting to MongoDB', err))

if (process.env.NODE_ENV === 'development') {
  Subscriber.deleteMany({})
    .then(() => info('cleared database'))
}

// Parse request body and verifies incoming requests using discord-interactions package
if (process.env.NODE_ENV !== 'test') {
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
