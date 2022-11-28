const { verifyKey } = require('discord-interactions')
const { discordRequest, installCommand } = require('./requests')

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
  const endpoint = `/channels/${channelId}/messages/${messageId}`
  return discordRequest(endpoint, {
    method: 'patch',
    data,
  })
}

const deleteMessage = async (channelId, messageId) => {
  const endpoint = `/channels/${channelId}/messages/${messageId}`
  return discordRequest(endpoint, {
    method: 'delete',
  })
}

// Installs a command
async function installGuildCommand(command) {
  return installCommand(command);
}

// Checks for a command
async function hasGuildCommand(data, command) {
  // API endpoint to get and post guild commands
  if (data) {
    const installedNames = data.map((c) => c.name);
    // This is just matching on the name, so it's not good for updates
    if (!installedNames.includes(command.name)) {
      await installGuildCommand(command);
    }
  }
}

async function hasGuildCommands(appId, guildId, commands) {
  if (guildId === '' || appId === '') return

  const endpoint = `/applications/${appId}/guilds/${guildId}/commands`
  const res = await discordRequest(endpoint, { method: 'get' })
  const { data } = res

  for await (const command of commands) {
    await hasGuildCommand(data, command)
  }
}

function verifyDiscordRequest(clientKey) {
  // eslint-disable-next-line no-unused-vars, func-names
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

module.exports = {
  createDmChannel,
  sendMessage,
  updateMessage,
  deleteMessage,
  installGuildCommand,
  hasGuildCommands,
  verifyDiscordRequest,
}
