const { InteractionResponseType } = require('discord-interactions')
const mongoose = require('mongoose')
const config = require('../config')

const createConnection = async () => mongoose.connect(config.MONGODB_URI)

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

async function sleep(ms) {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function replyToInteraction(req, res, data) {
  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data,
  })
}

module.exports = {
  capitalize,
  sleep,
  replyToInteraction,
  createConnection,
}
