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

const sendMessage = async (channelId, data) => {
  const endpoint = `/channels/${channelId}/messages`
  return discordRequest(endpoint, {
    method: 'post',
    data,
  })
}

const updateMessage = async (channelId, messageId, data) => {
  const endpoint = `/channels/${channelId}/messages${messageId}`
  return discordRequest(endpoint, {
    method: 'patch',
    data,
  })
}

module.exports = {
  createDmChannel,
  sendMessage,
  updateMessage,
}
