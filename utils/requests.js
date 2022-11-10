import dotenv from 'dotenv'
import axios from 'axios'

const { DISCORDTOKEN, APPID, GUILDID } = dotenv.config().parsed

async function checkLimit(res){
  const limitRemaining = parseInt(res.headers['x-ratelimit-remaining'])
  const timeUntilReset = parseInt(res.headers['x-ratelimit-reset-after'])
  console.log(res.headers)
  console.log(`Limit remaining: ${limitRemaining}`)

  if(!limitRemaining) { return }

  if(limitRemaining === 0){
    console.log(`Sleeping for ${timeUntilReset}`);
    await sleep(timeUntilReset * 1000 + 100)
  }
}

export const installCommand = async command => {
  const endpoint = `/${APPID}/guilds/${GUILDID}/commands`
  try {
    const res = await discordRequest(endpoint, {
      method: 'post',
      data: command
    })

    return res
  } catch (error) {
    console.log('Error installing commands');
    console.log('CODE', error.code)
    throw new Error(error.message)
  }
}

export async function discordRequest(endpoint, options){
  const baseurl = 'https://discord.com/api/v10'
  const url = baseurl + endpoint
  console.log(options)
  try {
    const res = await axios({
      url,
      headers: {
        Authorization: `Bot ${DISCORDTOKEN}`,
        'Content-Type': 'application/json; charset=UTF-8',
        'User-Agent': 'DiscordBot (1.0.0)',
      },
      ...options
    })

    await checkLimit(res)

    return res
  } catch (error) {
    console.log('Error with discord request function')
    console.log('CODE', error.message)
  }
}

async function request(){

}