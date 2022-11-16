const Subscriber = require('../models/Subscriber')
const { error } = require('../utils/logger')

const get = async discordid => Subscriber.findOne({ discordid })

const create = async sub => {
  const createThis = new Subscriber({
    username: sub.username,
    discordid: sub.discordid,
    cities: sub.cities,
    time: sub.time || 800,
    utcOffset: sub.utcOffset || 0,
    dmChannel: sub.dmChannel,
  })
  try {
    const created = await createThis.save()
    return !!created
  } catch (err) {
    error(err)
    return false
  }
}

const update = async (discordid, data) => {
  const updateThis = {
    ...data,
  }

  if (updateThis.cities) {
    delete updateThis.cities
  }
  try {
    const updated = await Subscriber.findOneAndUpdate(
      { discordid },
      updateThis,
      { runValidators: true },
    )

    return !!updated
  } catch (err) {
    error(err)
    return false
  }
}

const remove = async discordid => Subscriber.findOneAndRemove({ discordid })

const getAll = async () => Subscriber.find({})

module.exports = {
  get,
  create,
  update,
  remove,
  getAll,
}
