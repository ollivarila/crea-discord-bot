const mongoose = require('mongoose')

const leaderboardSchema = new mongoose.Schema({
  name: String,
  guildId: String,
  channelId: String,
  messageId: String,
  players: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
    },
  ],
})

module.exports = mongoose.model('Leaderboard', leaderboardSchema)
