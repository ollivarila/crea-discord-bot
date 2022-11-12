const { GuildExplicitContentFilter } = require('discord.js')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app.js')

const api = supertest(app)

let mockCommand

beforeAll(() => {

})

beforeEach(() => {
  mockCommand = {
    data: {
      member: {
        user: {
          username: 'testuser'
        }
      }
    },
    type: 2
  }
})


describe('Discord interactions tests', () => {
  
  test('Api responds to verification requests', async () => {
    const res = await api.post('/interactions').send({
      type: 1
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
          name: "message",
          type: 3,
          value: "moi"
      }]
      const res = await api.post('/interactions').send(mockCommand)
      expect(res.body.data.content).toBe('moi')
      expect(res.body.type).toBe(4)
      expect(res.status).toBe(200)
      })
    
    test('Api responds correctly to /gay', async () => {
      mockCommand.data.name = 'gay'
      const res = await api.post('/interactions').send(mockCommand)
      expect(res.body.data.content).toMatch(/testuser\s/)
      expect(res.status).toBe(200)
    })    


    test('Api responds correctly to /route', async () => {
      mockCommand.data.name = 'route'
      const options = [
        {
            name: "start",
            type: 3,
            value: "kamppi"
        },
        {
            name: "end",
            type: 3,
            value: "pasila"
        }
      ]
      mockCommand.data.options = options
      const res = await api.post('/interactions').send(mockCommand)
      expect(res.body.data.content).not.toBe('vammaset tiedot')
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
        name: "query",
        type: 3,
        value: "test"
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
        value: 'espoo'
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
          value: 'espoo'
        },
        {
          name: 'time',
          type: 3,
          value: '8:00'
        },
        {
          name: 'timezone',
          type: 3,
          value: 1
        }
      ]
      const res = await api.post('/interactions').send(mockCommand)
      
      expect(res.body.data.content).toBe('Subscribed to espoo at 8:00')
      expect(res.status).toBe(200)
    })

    describe('Incorrect interaction options', () => {

      test('/route', async () => {
        mockCommand.data.name = 'route'
        const options = [
          {
              name: "start",
              type: 3,
              value: "incorrect"
          },
          {
              name: "end",
              type: 3,
              value: "definitely incorrect"
          }
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
          value: 'incorrect'
        }]
        const res = await api.post('/interactions').send(mockCommand)
        console.log(res.body.data)
        expect(res.body.data.content).toBe('Weather not found with queries: incorrect')
        expect(res.status).toBe(200)
      })

      test('/subscribe', async () => {
        mockCommand.data.name = 'subscribe'
        mockCommand.data.options = [
          {
            name: 'query',
            type: 3,
            value: 'incorrect'
          },
          {
            name: 'time',
            type: 3,
            value: '80:0'
          },
          {
            name: 'timezone',
            type: 3,
            value: 7
          }
        ]
        const res = await api.post('/interactions').send(mockCommand)

        expect(res.body.data.content).toBe('Something went wrong with command check parameters: incorrect 80:0 7')
        expect(res.status).toBe(200)
      })
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})