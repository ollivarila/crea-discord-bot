import mongoose from "mongoose"

const subscriberSchema = new mongoose.Schema({
  username: String,
  discordid: Number,
  cities: String,
  time: String,
  timezone: String,
})

subscriberSchema.set('toJSON', {
  transform: (doc, retObj) => {
    retObj.id = retObj._id.toString(),
    delete retObj._id,
    delete retObj.__v
  }
})

export default mongoose.model('Subscriber', subscriberSchema)