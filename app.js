const express = require('express')
require('express-async-errors')
const { verifyDiscordRequest } = require('./utils/discordUtils')
const loggerMiddleware = require('./utils/loggerMiddleware')
const interactionRouter = require('./controllers/interactionRouter')
const { info } = require('./utils/logger')
const onStartUp = require('./utils/startUp')

const {
  PUBLICKEY, GUILDID, APPID, DISCORDTOKEN, WEATHERTOKEN,
} = process.env
const app = express()

if (!(PUBLICKEY && GUILDID && APPID && DISCORDTOKEN && WEATHERTOKEN)) {
  throw new Error('Environment variables not set correctly')
}

onStartUp().then(() => info('startup completed'))

// For health checks
app.get('/health', (req, res) => {
  res.send('ok')
})

// To see if version has actually updated
app.get('/version', (req, res) => {
  res.send('1')
})

// Parse request body and verifies incoming requests using discord-interactions package
if (process.env.NODE_ENV !== 'test') {
  app.use(express.json({ verify: verifyDiscordRequest(process.env.PUBLICKEY) }));
} else {
  app.use(express.json())
}

app.use(loggerMiddleware)

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.use('/interactions', interactionRouter)
const port = process.env.PORT || 3000
app.listen(port, () => info(`Listening on port ${port}`))

module.exports = app
