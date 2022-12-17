const mongoose = require('mongoose')

const commandSchema = new mongoose.Schema({
  name: String,
  timesUsed: Number,
  commandId: String,
  guild: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GuildStats',
  },
})

module.exports = mongoose.model('Command', commandSchema)
