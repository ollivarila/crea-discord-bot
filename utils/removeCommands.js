/* eslint-disable no-await-in-loop */
const dotenv = require('dotenv')
const { discordRequest } = require('./requests')
const { info, error } = require('./logger')

dotenv.config()

const baseUrl = `/applications/${process.env.APPID}/guilds/${process.env.GUILDID}/commands`

const removeCommand = async name => {
  let data = await discordRequest(baseUrl, { method: 'get' })
  const command = data.find(e => e.name === name)
  data = await discordRequest(`${baseUrl}/${command.id}`, {
    method: 'delete',
  })

  if (!data) {
    error(`Error removing command ${name}`)
  } else {
    info(`Removed command ${name}`)
  }
}

const removeCommands = async () => {
  info('Removing commands...')
  const data = await discordRequest(baseUrl, {
    method: 'get',
  })
  const commandIds = data.map(e => e.id)
  let success = true
  for await (const id of commandIds) {
    const response = await discordRequest(`${baseUrl}/${id}`, {
      method: 'delete',
    })
    if (response === null) {
      error(`Error removing command ${data.filter(e => e.id === id).pop()}`)
      success = false
    }
  }
  if (success) {
    info('Commands removed!')
  } else {
    info('Some commands could not be removed')
  }
}

if (process.env.NODE_ENV !== 'test') {
  const name = process.env.REMOVETHIS
  if (name) {
    removeCommand(name)
  } else {
    removeCommands()
  }
}

module.exports = {
  removeCommand,
}
