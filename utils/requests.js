const axios = require('axios')
const { sleep } = require('../utils.js')
const dotenv = require('dotenv')
dotenv.config()
const { APPID, GUILDID, DISCORDTOKEN } = process.env

async function checkLimit(res){
  const limitRemaining = res.headers['x-ratelimit-remaining']
  const timeUntilReset = res.headers['x-ratelimit-reset-after']
  
  if(limitRemaining === undefined) { return }

  console.log(`Limit remaining: ${limitRemaining}`)

  if(parseInt(limitRemaining) === 0){
    console.log(`Sleeping for ${timeUntilReset}`);
    await sleep(timeUntilReset * 1000 + 100)
  }
}

const installCommand = async command => {
  const endpoint = `/applications/${APPID}/guilds/${GUILDID}/commands`
  try {
    const res = await discordRequest(endpoint, {
      method: 'post',
      data: command
    })
    return res
  } catch (error) {
    console.error(error)
  }
}

async function discordRequest(endpoint, options){
  const baseurl = 'https://discord.com/api/v10'
  const url = baseurl + endpoint
  const headers = {
    Authorization: `Bot ${DISCORDTOKEN}`,
    'User-Agent': 'DiscordBot (1.0.0)',
  }
  const res = await axios.request({
    url,
    headers,
    ...options
  })
  await checkLimit(res)
  return res
}

async function request(url, options){
  const res = await axios.request({
    url,
    ...options
  })
  return res
}

module.exports = {
  installCommand,
  request,
  discordRequest
}