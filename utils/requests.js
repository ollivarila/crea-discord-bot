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
  const url = `https://discord.com/api/v10/applications/${APPID}/guilds/${GUILDID}/commands`
  try {
    const res = await axios.post(url, command, {
      headers: {
        'Authorization': `Bot ${DISCORDTOKEN}`,
        'User-Agent': 'DiscordBot (1.0.0)',
      }
    })
    await checkLimit(res)
    return res
  } catch (error) {
    console.log('CODE', error.code)
    console.log(error)
    throw new Error('Error installing command')
  }
}

async function discordGet(endpoint, options){
  const baseurl = 'https://discord.com/api/v10'
  const url = baseurl + endpoint
  console.log(url)
  const res = await axios.request({
    url,
    headers: {
      Authorization: `Bot ${DISCORDTOKEN}`,
      'User-Agent': 'DiscordBot (1.0.0)',
    },
    ...options
  })

  await checkLimit(res)
  return res
}

async function discordPost(endpoint, options){
  const baseurl = 'https://discord.com/api/v10'
  const url = baseurl + endpoint
  const res = await axios.request({
    url: url,
    headers: {
      Authorization: `Bot ${DISCORDTOKEN}`,
      'User-Agent': 'DiscordBot (1.0.0)',
    },
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
  discordPost,
  discordGet,
  request
}