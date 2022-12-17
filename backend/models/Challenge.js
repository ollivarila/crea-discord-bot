const mongoose = require('mongoose')

const challengeSchema = new mongoose.Schema({
  interactionid: String,
  challengerName: String,
  challengerid: String,
  challengedName: String,
  challengedid: String,
  accepted: Boolean,
  token: String,
})

module.exports = mongoose.model('Challenge', challengeSchema)
