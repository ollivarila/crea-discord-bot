const dao = require('../../dao/subscriberDao')
const mongoose = require('mongoose')
const config = require('../../config')
const Subscriber = require('../../models/Subscriber')
const { info, error } = require('../../utils/logger')
 
//Connect to test DB
beforeAll( async () => {
  return mongoose.connect(config.MONGODB_URI)
    .then(() => {
      info('connected to mongodb')
    })
    .catch(err => error(err))
})

describe('SubscriberDao', () => {
  let testSub
  //Remove all subs and create one
  beforeEach(async () => {
    testSub = new Subscriber({
      username: 'testuser',
      discordid: '123',
      cities: 'espoo, helsinki',
      time: '800',
      utcOffset:  7200,
      dmChannel: 321
    })
    await Subscriber.deleteMany({})
    await testSub.save()
  })

  test('database connection', async () => {
    const sub = await Subscriber.findOne({})
    expect(sub.username).toBe(testSub.username)
  })

  test('get', async () => {
    const subscriber = await dao.get(123)
    expect(subscriber.discordid).toBe(testSub.discordid)
  })

  test('create', async () => {
    const newSub = {
      username: 'testuser2',
      discordid: '12345',
      cities: 'espoo, helsinki',
      time: '800',
      utcOffset:  0,
      dmChannel: 1234
    }

    const result = await dao.create(newSub)
    const created = await Subscriber.findOne({ discordid: 12345 })
    expect(created.discordid).toBe(newSub.discordid)
  })

  test('update', async () => {
    const result = await dao.update(123, { username: 'updated' })
    const updatedSub = await Subscriber.findOne({ discordid: 123 })
    expect(updatedSub.username).toBe('updated')
    expect(result).toBe(true)
  })

  test('remove', async () => {
    const result = await dao.remove(123)
    const removed = await Subscriber.findOne({ discordid: 123 })
    expect(result).toBe(true)
    expect(removed).toBeFalsy()
  })

  test('getAll', async () => {
    const subs = await dao.getAll()
    expect(subs.length).toBe(1)
  })

  test('get invalid data', async () => {
    const sub = await dao.get(321)
    expect(sub).toBe(null)
  })

  test('create invalid data', async () => {
    const falseUser = {
      username: 'testuser2',
      discordid: 1234,
      timezone:  7200
    }
    const created = await dao.create(falseUser)
    const createdSub = await Subscriber.findOne({ discordid: falseUser.discordid })
    expect(created).toBe(false)
    expect(createdSub).toBe(null)
  })


  test('remove invalid data', async () => {
    const result = await dao.remove(132)
    const user = await Subscriber.findOne({ discordid: testSub.discordid })
    expect(result).toBe(false)
    expect(user.discordid).toBe(testSub.discordid)
  })
})

afterAll(async () => {
  await Subscriber.deleteMany({})
  return mongoose.connection.close().then(() => {
    info('connection closed')
  })
  .catch(err => error(err))
})