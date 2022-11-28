/* eslint-disable no-await-in-loop */
const { discordRequest } = require('./requests')
const { info, error } = require('./logger')

const baseUrl = `/applications/${process.env.APPID}/guilds/${process.env.GUILDID}/commands`

const removeCommand = async name => {
  let res = await discordRequest(baseUrl, { method: 'get' })
  const { data } = res
  const { id } = data.find(e => e.name === name)

  res = await discordRequest(`${baseUrl}/${id}`, {
    method: 'delete',
  })

  if (!res) {
    error(`Error removing command ${name}`)
  } else {
    info(`Removed command ${name}`)
  }
}

const removeCommands = async () => {
  info('Removing commands...')
  const res = await discordRequest(baseUrl, {
    method: 'get',
  })
  const { data } = res
  const commandIds = data.map(e => e.id)

  for await (const id of commandIds) {
    const response = await discordRequest(`${baseUrl}/${id}`, {
      method: 'delete',
    })
    if (!response) {
      error(`Error removing command ${data.filter(e => e.id === id).pop()}`)
    }
  }
  info('Commands removed!')
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
