const { discordRequest } = require('./requests.js')
 
const baseUrl = `/applications/${process.env.APPID}/guilds/${process.env.GUILDID}/commands`

const removeCommand = async name => {
  try {
    let res = await discordRequest(baseUrl, { method: 'get'})
    const data = res.data
    const id = data.find(e => e.name === name).id

    res = await discordRequest(`${baseUrl}/${id}`, {
      method: 'delete'
    })

    if(res.status === 204){
      console.log('Removed command ' + id)
    } else {
      console.error('Error removing command ' + id)
    }
  } catch (error) {
    console.error(error)
  }
  console.log('success')
}

const removeCommands = async () => {

  try {
    const res = await discordRequest(baseUrl, {
      method: 'get'
    })
    const data = res.data
    const commandIds = data.map(e => e.id)

    for(const id of commandIds){
      const res = await discordRequest(`${baseUrl}/${id}`, {
        method: 'delete'
      })

      if(res.status === 204){
        console.log('Removed command ' + id)
      } else {
        console.error('Error removing command ' + id)
      }
    }
  } catch (error) {
    console.log('CODE', error.code)
    console.log('DATA', error.response.data)
    process.exit(1)
  }
  console.log('success')
}

if(process.env.NODE_ENV !== 'test'){
  const name = process.env.REMOVETHIS
  if(name){
    removeCommand(name)
  } else {
    removeCommands()
  }  
}


module.exports = {
  removeCommand
}