const express = require('express')
require('express-async-errors')
const mongoose = require('mongoose')
const { VerifyDiscordRequest } = require('./utils')
const loggerMiddleware = require('./utils/loggerMiddleware')
const interactionRouter = require('./controllers/interactionRouter')
const { MONGODB_URI } = require('./config')
const { info, error } = require('./utils/logger')
const subDao = require('./dao/subscriberDao')
const jobController = require('./controllers/jobController')

const app = express()

mongoose.connect(MONGODB_URI).then(async () => {
  info('Connected to MongoDB')
  const subs = await subDao.getAll()
  subs.forEach(sub => {
    jobController.createJob(sub)
  })
  info(jobController.getAll())
}).catch(err => error('Error connecting to MongoDB', err))

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
