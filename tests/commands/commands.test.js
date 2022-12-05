/* eslint-disable no-console */
/* eslint-disable no-undef */
const { subscribeUser } = require('../../commands/subscribe')
const { createConnection } = require('../../utils/misc')
const mock = require('../__mocks__/mockAxios')

describe('Subscribe tests', () => {
  beforeAll(async () => createConnection())

  afterEach(async () => {
    mock.reset()
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
