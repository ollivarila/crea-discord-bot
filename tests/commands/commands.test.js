/* eslint-disable no-console */
/* eslint-disable no-undef */
const mongoose = require('mongoose')
const { createDmChannel, subscribeUser } = require('../../commands/subscribe')
const { discordRequest } = require('../../utils/requests')
const { getPP } = require('../../commands/pp')
const config = require('../../config')
const { info, error } = require('../../utils/logger')

describe('Subscribe tests', () => {
  const discordid = '188329879861723136'

  beforeAll(async () => mongoose.connect(config.MONGODB_URI)
    .then(() => {
      info('connected to mongodb')
    })
    .catch(err => error(err)))

  afterEach(async () => {
    const endpoint = '/channels/1041324752293347358'
    await discordRequest(endpoint, {
      method: 'delete',
    })
  })

  test('createDmChannel()', async () => {
    const res = await createDmChannel(discordid)
    expect(res.recipients[0].username).toBe('Crea')
  })

  const mockCallback = jest.fn()
  test('subscribeUser()', async () => {
    const user = {
      username: 'test',
      discordid: '188329879861723136',
      citiesCsv: 'espoo',
      time: '8:00',
      utcOffset: 1,
    }
    const res = await subscribeUser(user, (data) => {
      console.log(data)
    })
    expect(res).toBe('Subscribed!')
    expect(mockCallback.mock.calls.length).toBe(0)
  })
})

describe('Pp tests', () => {
  test('getAnswer returns correct answer', () => {
    const ans = getPP('user')
    expect(ans).toMatch(/B=*D/)
  })
})
