const express = require('express')
require('express-async-errors')
const mongoose = require('mongoose')
const { VerifyDiscordRequest } = require('./utils')
const loggerMiddleware = require('./utils/loggerMiddleware')
const interactionRouter = require('./controllers/interactionRouter')
const { info, error } = require('./utils/logger')
const subDao = require('./dao/subscriberDao')
const jobController = require('./controllers/jobController')
const config = require('./config')
const Challenge = require('./models/Challenge')
const { handleWeatherUpdate } = require('./commands/subscribe')

const {
  PUBLICKEY, GUILDID, APPID, DISCORDTOKEN, WEATHERTOKEN,
} = process.env
const app = express()

if (!(PUBLICKEY && GUILDID && APPID && DISCORDTOKEN && WEATHERTOKEN)) {
  throw new Error('Environment variables not set correctly')
}

mongoose.connect(config.MONGODB_URI).then(async () => {
  info('Connected to MongoDB')
  await Challenge.deleteMany({})
  const subs = await subDao.getAll()
  subs.forEach(sub => {
    jobController.createJob(sub, handleWeatherUpdate({ discordid: sub.discordid }))
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

// For health checks
app.get('/health', (req, res) => {
  res.send('ok')
})

// To see if version has actually updated
app.get('/version', (req, res) => {
  res.send('1')
})

module.exports = app
