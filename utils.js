import 'dotenv/config';
import { verifyKey } from 'discord-interactions';
import axios from 'axios';

export function VerifyDiscordRequest(clientKey) {
  return function (req, res, buf, encoding) {
    const signature = req.get('X-Signature-Ed25519');
    const timestamp = req.get('X-Signature-Timestamp');

    const isValidRequest = verifyKey(buf, signature, timestamp, clientKey);
    if (!isValidRequest) {
      res.status(401).send('Bad request signature');
      throw new Error('Bad request signature');
    }
  };
}

export async function DiscordRequest(endpoint, options) {
  // append endpoint to root API URL
  const url = 'https://discord.com/api/v10/' + endpoint;
  // Stringify payloads
  
  // Use node-fetch to make requests
  const res = await axios.request({
    url,
    headers: {
      'Authorization': `Bot ${process.env.TOKEN}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'User-Agent': 'DiscordBot (1.0.0)',
    },
    ...options
  });
  // throw API errors
  if (res.status !== 200) {
    console.log(res)
    const data = res.data;
    console.log(res.status);
    throw new Error('Error with DiscordRequest');
  }
  // return original response
  return res;
}

export const installCommand = async command => {
  const url = `https://discord.com/api/v10/applications/${process.env.APP_ID}/guilds/${process.env.GUILD_ID}/commands`
  const res = await axios({
    method: 'post',
    url,
    data: command,
    headers: {
      'Authorization': `Bot ${process.env.TOKEN}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'User-Agent': 'DiscordBot (1.0.0)',
    }
  })


  if(res.status !== 201){
    console.error('Error installing command' + command)
  }

  return res
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
