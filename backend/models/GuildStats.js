const mongoose = require('mongoose')

const statsSchema = new mongoose.Schema({
  guildId: String,
  uptime: Date,
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  commandsUsed: Number,
  commands: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Command',
    },
  ],
})

module.exports = mongoose.model('GuildStats', statsSchema)
