import axios from "axios";
import dotenv from 'dotenv'
import { sleep } from '../utils.js'
dotenv.config()

const baseUrl = 'https://discord.com/api/v10'
const guild = process.env.GUILD_ID
const appId = process.env.APP_ID

const URL = `${baseUrl}/applications/${appId}/guilds/${guild}/commands`


const res = await axios.get(URL, {
  headers: {
    Authorization: `Bot ${process.env.TOKEN}`
  }
})

const data = await res.data

const commandIds = data.map(e => e.id)

console.log(commandIds);

commandIds.forEach(async id => {
  sleep(200).then( async () => {
    const res = await axios.delete(`${URL}/${id}`, {
      headers: {
        Authorization: `Bot ${process.env.TOKEN}`
      }
    })
    if(res.status === 204){
      console.log('Removed command ' + id)
    } else {
      console.error('Error removing command ' + id)
    }  
  })


})