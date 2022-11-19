const mongoose = require('mongoose')

const playerSchema = new mongoose.Schema({
  name: String,
  guildId: String,
  leaderboard: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Leaderboard',
  },
  stats: String,
})

module.exports = mongoose.model('Player', playerSchema)
