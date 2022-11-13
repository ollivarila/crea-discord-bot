const mongoose = require('mongoose')

const subscriberSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  discordid: {
    type: Number,
    required: true
  },
  cities: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: false
  },
  timezone: {
    type: Number,
    required: false
  }
})

subscriberSchema.set('toJSON', {
  transform: (doc, retObj) => {
    retObj.id = retObj._id.toString(),
    delete retObj._id,
    delete retObj.__v
  }
})

module.exports = mongoose.model('Subscriber', subscriberSchema)