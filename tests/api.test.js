/* eslint-disable no-undef */
const mongoose = require('mongoose')
const supertest = require('supertest')
const dotenv = require('dotenv')
const app = require('../app')
const { discordRequest } = require('../utils/requests')
const subDao = require('../dao/subscriberDao')

dotenv.config()
let mockCommand
const api = supertest(app)

beforeEach(() => {
  mockCommand = {
    data: {
    },
    member: {
      user: {
        username: 'testuser',
        id: '188329879861723136',
      },
    },
    type: 2,
  }
})

describe('Discord interactions tests', () => {
  test('Api responds to verification requests', async () => {
    const res = await api.post('/interactions').send({
      type: 1,
    })
    expect(res.status).toBe(200)
    expect(res.body.type).toBe(1)
  })

  test('Api responds correctly to illegal path', async () => {
    const res = await api.get('/bad')

    expect(res.status).toBe(404)
  })

  describe('Interactions', () => {
    test('Api responds correctly to /echo', async () => {
      mockCommand.data.name = 'echo'
      mockCommand.data.options = [{
        name: 'message',
        type: 3,
        value: 'moi',
      }]
      const res = await api.post('/interactions').send(mockCommand)
      expect(res.body.data.content).toBe('moi')
      expect(res.body.type).toBe(4)
      expect(res.status).toBe(200)
    })

    test('Api responds correctly to /route', async () => {
      mockCommand.data.name = 'route'
      const options = [
        {
          name: 'start',
          type: 3,
          value: 'kamppi',
        },
        {
          name: 'end',
          type: 3,
          value: 'pasila',
        },
      ]
      mockCommand.data.options = options
      const res = await api.post('/interactions').send(mockCommand)
      expect(res.body.data.content).not.toBe('Route not found')
      expect(res.status).toBe(200)
    })

    test('Api responds correctly to /ping', async () => {
      mockCommand.data.name = 'ping'
      const res = await api.post('/interactions').send(mockCommand)
      expect(res.body.data.content).toBe('pong')
      expect(res.status).toBe(200)
    })

    test('Api responds correctly to /pp', async () => {
      mockCommand.data.name = 'pp'
      const res = await api.post('/interactions').send(mockCommand)
      expect(res.body.data.content).toMatch(/B=*D/)
      expect(res.status).toBe(200)
    })

    test('Api responds correctly to /search', async () => {
      mockCommand.data.name = 'search'
      mockCommand.data.options = [{
        name: 'query',
        type: 3,
        value: 'test',
      }]
      const res = await api.post('/interactions').send(mockCommand)
      expect(res.body.data.content).toMatch(/https:/)
      expect(res.status).toBe(200)
    })

    test('Api responds correctly to /weather', async () => {
      mockCommand.data.name = 'weather'
      mockCommand.data.options = [{
        name: 'query',
        type: 3,
        value: 'espoo',
      }]
      const res = await api.post('/interactions').send(mockCommand)
      expect(res.body.data.embeds).toBeDefined()
      expect(res.status).toBe(200)
    })

    test('Api responds correctly to /subscribe', async () => {
      mockCommand.data.name = 'subscribe'
      mockCommand.data.options = [
        {
          name: 'query',
          type: 3,
          value: 'espoo',
        },
        {
          name: 'time',
          type: 3,
          value: '8:00',
        },
        {
          name: 'utcoffset',
          type: 3,
          value: 1,
        },
      ]
      const res = await api.post('/interactions').send(mockCommand)

      expect(res.body.data.content).toBe('Subscribed!')
      expect(res.status).toBe(200)
    })

    test('Api responds correctly to /unsubscribe', async () => {
      mockCommand.data.name = 'unsubscribe'
      const res = await api.post('/interactions').send(mockCommand)

      expect(res.body.data.content).toBe('Unsubscribed!')
    })

    describe('Incorrect interaction options', () => {
      test('/route', async () => {
        mockCommand.data.name = 'route'
        const options = [
          {
            name: 'start',
            type: 3,
            value: 'incorrect',
          },
          {
            name: 'end',
            type: 3,
            value: 'definitely incorrect',
          },
        ]
        mockCommand.data.options = options
        const res = await api.post('/interactions').send(mockCommand)

        expect(res.body.data.content).toBe('Route not found')
        expect(res.status).toBe(200)
      })

      test('/weather', async () => {
        mockCommand.data.name = 'weather'
        mockCommand.data.options = [{
          name: 'query',
          type: 3,
          value: 'incorrect',
        }]
        const res = await api.post('/interactions').send(mockCommand)
        expect(res.body.data.content).toBe('Weather not found with queries: incorrect')
        expect(res.status).toBe(200)
      })

      test('/subscribe', async () => {
        mockCommand.data.name = 'subscribe'
        mockCommand.data.options = [
          {
            name: 'query',
            type: 3,
            value: 'incorrect',
          },
          {
            name: 'time',
            type: 3,
            value: '80:0',
          },
          {
            name: 'utcoffset',
            type: 3,
            value: 24,
          },
        ]
        const res = await api.post('/interactions').send(mockCommand)

        expect(res.body.data.content).toBe('Subscription failed, reason: incorrect, 80:0, Offset should be between -12 and 14')
        expect(res.status).toBe(200)
      })
    })
  })
})

afterAll(async () => {
  await subDao.removeAll({})
  mongoose.connection.close()
  const endpoint = '/channels/1041324752293347358'
  await discordRequest(endpoint, {
    method: 'delete',
  })
})
