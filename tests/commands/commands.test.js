/* eslint-disable no-console */
/* eslint-disable no-undef */
const mongoose = require('mongoose')
const axios = require('axios')
const { default: MockAdapter } = require('axios-mock-adapter')
const { createDmChannel, subscribeUser } = require('../../commands/subscribe')
const { getPP } = require('../../commands/pp')
const config = require('../../config')
const { info, error } = require('../../utils/logger')

describe('Subscribe tests', () => {
  const discordid = '188329879861723136'

  beforeAll(async () => {
    mock = new MockAdapter(axios)
    return mongoose.connect(config.MONGODB_URI)
      .then(() => {
        info('connected to mongodb')
      })
      .catch(err => error(err))
  })

  afterEach(async () => {
    mock.reset()
  })

  test('createDmChannel()', async () => {
    const mockRes = {
      data: {
        id: '1041324752293347358',
        type: 1,
        last_message_id: '1042432599638949938',
        flags: 0,
        recipients: [
          {
            id: '188329879861723136',
            username: 'LMAO',
            avatar: '73635435b3a4ed04a23ff50c4fd04e74',
            avatar_decoration: null,
            discriminator: '0157',
            public_flags: 640,
          },
        ],
      },
    }
    const url = 'https://discord.com/api/v10/users/@me/channels'
    mock.onPost(url).reply(200, mockRes.data)

    const res = await createDmChannel(discordid)
    // expect(res.recipients[0].username).toBe('Crea')
    expect(res).toEqual(mockRes.data)
  })

  test('subscribeUser()', async () => {
    const user = {
      username: 'test',
      discordid: '188329879861723136',
      citiesCsv: 'espoo',
      time: '8:00',
      utcOffset: 1,
    }
    const url = /https:\/\/api.openweathermap.org*/
    const mockRes = {
      data: {
        id: '1041324752293347358',
        type: 1,
        last_message_id: '1042432599638949938',
        flags: 0,
        recipients: [
          {
            id: '188329879861723136',
            username: 'LMAO',
            avatar: '73635435b3a4ed04a23ff50c4fd04e74',
            avatar_decoration: null,
            discriminator: '0157',
            public_flags: 640,
          },
        ],
      },
    }
    const urlCreateDm = 'https://discord.com/api/v10/users/@me/channels'
    mock.onPost(url).reply(200, mockRes.data)
    mock.onPost(urlCreateDm).reply(200, { id: 123 })

    mock.onGet(url).reply(200, { list: [1, 2, 3] })
    const res = await subscribeUser(user)
    expect(res).toBe('Subscribed!')
  })
})

describe('Pp tests', () => {
  test('getAnswer returns correct answer', () => {
    const ans = getPP('user')
    expect(ans).toMatch(/B=*D/)
  })
})
