const axios = require('axios')
const dotenv = require('dotenv')
const { sleep } = require('./misc')
const { info, error } = require('./logger')

dotenv.config()

const { APPID, GUILDID, DISCORDTOKEN } = process.env

async function checkLimit(res) {
  const limitRemaining = res.headers['x-ratelimit-remaining']
  const timeUntilReset = res.headers['x-ratelimit-reset-after']
  if (limitRemaining === undefined) return
  if (parseInt(limitRemaining, 10) === 0) {
    info(`Limit reached sleeping for ${timeUntilReset}s`);
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
  const res = await axios.request({
    url,
    headers,
    ...options,
  }).catch(err => {
    error('Error with discord request', err)
    return null
  })

  if (!res) return null

  await checkLimit(res)

  return res.data
}

const installCommand = async command => {
  const endpoint = `/applications/${APPID}/guilds/${GUILDID}/commands`
  await discordRequest(endpoint, {
    method: 'post',
    data: command,
  })
    .then(() => info(`Installed command ${command.name}`))
    .catch(() => error('Error installing command'))
}

async function request(url, options) {
  return axios.request({
    url,
    ...options,
  })
    .then(res => res.data)
    .catch(err => {
      error('Error with request', err.message)
      return null
    })
}

module.exports = {
  installCommand,
  request,
  discordRequest,
}
