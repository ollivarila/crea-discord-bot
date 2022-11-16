/* eslint-disable no-await-in-loop */
const { discordRequest } = require('./requests')
const { info, error } = require('./logger')

const baseUrl = `/applications/${process.env.APPID}/guilds/${process.env.GUILDID}/commands`

const removeCommand = async name => {
  try {
    let res = await discordRequest(baseUrl, { method: 'get' })
    const { data } = res
    const { id } = data.find(e => e.name === name)

    res = await discordRequest(`${baseUrl}/${id}`, {
      method: 'delete',
    })

    if (res.status === 204) {
      info(`Removed command ${id}`)
    } else {
      error(`Error removing command ${id}`)
    }
  } catch (err) {
    error(error)
  }
}

const removeCommands = async () => {
  try {
    const res = await discordRequest(baseUrl, {
      method: 'get',
    })
    const { data } = res
    const commandIds = data.map(e => e.id)

    for (const id of commandIds) {
      const response = await discordRequest(`${baseUrl}/${id}`, {
        method: 'delete',
      })

      if (response.status === 204) {
        info(`Removed command ${id}`)
      } else {
        error(`Error removing command ${id}`)
      }
    }
  } catch (err) {
    info('CODE', err.code)
    info('DATA', err.response.data)
    process.exit(1)
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
