const mongoose = require('mongoose')
const Subscriber = require('../models/Subscriber')

const get = async discordid => {
  return await Subscriber.findOne({ discordid })
}

const create = async sub => {
  const createThis = new Subscriber({
    username: sub.username,
    discordid: sub.discordid,
    cities: sub.cities,
    time: sub.time | 800,
    timezone: sub.timezone | 7200
  })
  const created = await createThis.save()
    .catch(err => {
      return false
    })
  if(created) {
    return true
  }
  return false
}

const update = async (discordid, data) => {
  const updateThis = {
    ...data
  }

  if(updateThis.cities){
    delete updateThis.cities
  }

  return Subscriber.findOneAndUpdate(
    { discordid }, 
    updateThis, 
    { runValidators: true })
    .then(() => {
      return true
    })
    .catch(err => {
      console.error(err)
      return false
    })
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