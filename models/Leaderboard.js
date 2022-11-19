const mongoose = require('mongoose')

const leaderboardSchema = new mongoose.Schema({
  guildId: String,
  players: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
    },
  ],
})

module.exports = mongoose.model('Leaderboard', leaderboardSchema)
