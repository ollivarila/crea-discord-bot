import axios from "axios";
import dotenv from 'dotenv'
import { sleep,checkLimit } from '../utils.js'

const baseUrl = 'https://discord.com/api/v10'
const { DISCORDTOKEN, APPID, GUILDID } = dotenv.config().parsed



const URL = `${baseUrl}/applications/${APPID}/guilds/${GUILDID}/commands`

try {
  const res = await axios.get(URL, {
    headers: {
      Authorization: `Bot ${DISCORDTOKEN}`
    }
  })
  const data = res.data
  const commandIds = data.map(e => e.id)

  console.log(commandIds);

  for(const id of commandIds){
    await sleep(200)
    const res = await axios.delete(`${URL}/${id}`, {
      headers: {
        Authorization: `Bot ${DISCORDTOKEN}`
      }
    })

    await checkLimit(res)

    if(res.status === 204){
      console.log('Removed command ' + id)
    } else {
      console.error('Error removing command ' + id)
    }
  }
} catch (error) {
  console.log('error getting commands')
  console.log('CODE', error.code)
  console.log('DATA', error.response.data)
}
console.log('success')