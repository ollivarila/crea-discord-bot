/* eslint-disable no-undef */
const {
  createDmChannel,
  sendMessage,
  updateMessage,
  deleteMessage,
} = require('../../utils/discordUtils')
const mock = require('../__mocks__/mockAxios')

describe('Discord utils', () => {
  afterEach(() => {
    mock.resetHistory()
  })

  test('createDmChannel', async () => {
    const id = await createDmChannel('mockId')
    expect(id).toBe('mockChannelId')
    const history = mock.history.post[0]
    expect(history.url).toBe('https://discord.com/api/v10/users/@me/channels')
    expect(JSON.parse(history.data).recipient_id).toBe('mockId')
  })

  test('sendMessage', async () => {
    const data = await sendMessage('mockChannelId', { content: 'mockValue' })

    const history = mock.history.post[0]
    expect(data.id).toBe('mockMessageId')
    expect(history.url).toBe('https://discord.com/api/v10/channels/mockChannelId/messages')
  })

  test('deleteMessage', async () => {
    const data = await deleteMessage('mockChannelId', 'mockMessageId')
    const history = mock.history.delete[0]
    expect(data.id).toBe('mockMessageId')
    expect(history.url).toBe('https://discord.com/api/v10/channels/mockChannelId/messages/mockMessageId')
  })

  test('updateMessage', async () => {
    const data = await updateMessage('mockChannelId', 'mockMessageId', { content: 'mockValue' })
    const history = mock.history.patch[0]
    expect(data.id).toBe('mockMessageId')
    expect(history.url).toBe('https://discord.com/api/v10/channels/mockChannelId/messages/mockMessageId')
  })
})
