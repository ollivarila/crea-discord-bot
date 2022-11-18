const { discordRequest } = require('./requests')

const createDmChannel = async discordid => {
  const endpoint = '/users/@me/channels'
  const res = await discordRequest(endpoint, {
    method: 'post',
    data: {
      recipient_id: discordid,
    },
  })
  return res ? res.data.id : null
}

const sendDm = async (dmChannel, data) => {
  const endpoint = `/channels/${dmChannel}/messages`
  return discordRequest(endpoint, {
    method: 'post',
    data,
  })
}

module.exports = {
  createDmChannel,
  sendDm,
}
