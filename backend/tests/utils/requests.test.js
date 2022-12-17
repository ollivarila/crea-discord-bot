/* eslint-disable no-undef */
const axios = require('axios')
const { default: MockAdapter } = require('axios-mock-adapter')
const { request, discordRequest, installCommand } = require('../../utils/requests')
const { misc } = require('../../commands/misc')

describe('Request utils internal functionality tests', () => {
  mock = new MockAdapter(axios)
  beforeAll(() => {
    mock = new MockAdapter(axios)
  })

  afterEach(async () => {
    mock.reset()
  })

  test('request works properly', async () => {
    const testurl = 'https://localhost:3000/test'
    mock.onGet(testurl, { test: 'test' }).reply(200, { test: 'test' })

    const data = await request(testurl, {
      method: 'get',
      headers: {
        Authorization: 'test',
      },
      date: {
        test: 'test',
      },
    })
    expect(data.test).toBe('test')
    expect(mock.history.get[0].url).toBe(testurl)
  })

  test('discordRequest is sent properly', async () => {
    const testUrl = 'https://discord.com/api/v10'
    mock.onPost(/https:\/\/discord.com\/api\/v10*/, { testBody: 'test' }, expect.objectContaining({
      Authorization: expect.not.stringContaining('undefined'),
    })).reply(200, { testRes: 'test' })

    const data = await discordRequest('/channels', {
      method: 'post',
      data: {
        testBody: 'test',
      },
    })
    expect(data.testRes).toBe('test')
    expect(mock.history.post[0].url).toBe(`${testUrl}/channels`)
  })

  test('installCommand works properly', async () => {
    mock.onPost(/https:\/\/discord.com\/api\/v10*/).reply(200, { testRes: 'test' })

    await installCommand(misc)
    const data = JSON.parse(mock.history.post[0].data)
    expect(mock.history.post[0].url).toMatch(/https:\/\/discord.com\/api\/v10\/applications*/)
    expect(data.name).toBe(misc.name)
  })
})
