const axios = require('axios')
const dotenv = require('dotenv')
const { sleep } = require('../utils')
const { info, error } = require('./logger')

dotenv.config()

const { APPID, GUILDID, DISCORDTOKEN } = process.env

async function checkLimit(res) {
  const limitRemaining = res.headers['x-ratelimit-remaining']
  const timeUntilReset = res.headers['x-ratelimit-reset-after']

  if (limitRemaining === undefined) { return }

  info(`Limit remaining: ${limitRemaining}`)
  if (parseInt(limitRemaining, 10) === 0) {
    info(`Sleeping for ${timeUntilReset}`);
    await sleep(timeUntilReset * 1000 + 100)
  }
}

async function discordRequest(endpoint, options) {
  const baseurl = 'https://discord.com/api/v10'
  const url = baseurl + endpoint
  const headers = {
    Authorization: `Bot ${DISCORDTOKEN}`,
    'User-Agent': 'DiscordBot (1.0.0)',
  }
  try {
    const res = await axios.request({
      url,
      headers,
      ...options,
    })
    await checkLimit(res)
    return res
  } catch (err) {
    error(err)
    return null
  }
}

const installCommand = async command => {
  const endpoint = `/applications/${APPID}/guilds/${GUILDID}/commands`
  info(`Installing "${command.name}"`);
  const res = await discordRequest(endpoint, {
    method: 'post',
    data: command,
  })
  if (!res) {
    error('Error installing command')
  } else {
    info(`installed command ${command.name}`)
  }
}

async function request(url, options) {
  try {
    const res = await axios.request({
      url,
      ...options,
    })
    return res
  } catch (err) {
    error(err)
    return null
  }
}

module.exports = {
  installCommand,
  request,
  discordRequest,
}
