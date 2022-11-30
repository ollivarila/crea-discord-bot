const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: String,
  discordId: String,
  commandsUsed: Number,
  guild: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GuildStats',
  },
})

module.exports = mongoose.model('User', userSchema)
