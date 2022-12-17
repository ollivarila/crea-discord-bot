/* eslint-disable no-param-reassign, no-underscore-dangle, no-unused-expressions */
const mongoose = require('mongoose')

const subscriberSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  discordid: {
    type: String,
    required: true,
  },
  cities: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: false,
  },
  utcOffset: {
    type: Number,
    required: true,
  },
  dmChannel: {
    type: String,
    required: true,
  },
})

subscriberSchema.set('toJSON', {
  transform: (doc, retObj) => {
    retObj.id = retObj._id.toString()
    delete retObj._id
    delete retObj._v
  },
})

module.exports = mongoose.model('Subscriber', subscriberSchema)
