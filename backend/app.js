const express = require('express')
const { verifyDiscordRequest } = require('./utils/discordUtils')
const interactionRouter = require('./controllers/interactionRouter')
const { info } = require('./utils/logger')
const onStartUp = require('./utils/startUp')
const {
  interactionExtractor,
  interactionLogger,
  requestLogger,
} = require('./utils/middleware')
const { recordStatistics } = require('./controllers/statsController')

const { PUBLICKEY, APPID, DISCORDTOKEN, WEATHERTOKEN, PORT } = process.env
const app = express()

if (!(PUBLICKEY && APPID && DISCORDTOKEN && WEATHERTOKEN)) {
  throw new Error('Environment variables not set correctly')
}

onStartUp().then(() => info('startup completed'))

app.use(requestLogger)
// For health checks
app.get('/health', (req, res) => {
  res.send('ok')
})

// To see if version has actually updated
app.get('/version', (req, res) => {
  res.send('1')
})

// Parse request body and verifies incoming requests using discord-interactions package
if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'test:debug') {
  app.use(
    '/interactions',
    express.json({ verify: verifyDiscordRequest(process.env.PUBLICKEY) }),
  )
} else {
  app.use(express.json())
}

app.use('/interactions', interactionExtractor)
app.use('/interactions', interactionLogger)

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.use('/interactions', recordStatistics)
app.use('/interactions', interactionRouter)

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT || 3000, () => info(`Listening on port ${PORT}`))
}

module.exports = app
