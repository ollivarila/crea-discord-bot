const Subscriber = require('../models/Subscriber')
const { error, info } = require('../utils/logger')

const get = async discordid => {
  return await Subscriber.findOne({ discordid })
}

const create = async sub => {
  const createThis = new Subscriber({
    username: sub.username,
    discordid: sub.discordid,
    cities: sub.cities,
    time: sub.time || 800,
    utcOffset: sub.utcOffset || 0,
    dmChannel: sub.dmChannel
  })
  try {
    const created = await createThis.save()
    return created ? true : false
  } catch (err) {
    error(err)
    return false
  }
}

const update = async (discordid, data) => {
  const updateThis = {
    ...data
  }

  if(updateThis.cities){
    delete updateThis.cities
  }
  try {
    const updated = await Subscriber.findOneAndUpdate(
      { discordid }, 
      updateThis, 
      { runValidators: true })
    
    return updated ? true : false
  } catch (err) {
    error(err)
    return false
  }
}

const remove = async discordid => {
  const result = await Subscriber.findOneAndRemove({ discordid: discordid })
  return result ? true : false
}

const getAll = async () => {
  return await Subscriber.find({})
}

module.exports = {
  get,
  create,
  update,
  remove,
  getAll
}