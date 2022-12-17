/* eslint-disable no-undef */
const { ApplicationCommandOptionType } = require('discord.js')
const supertest = require('supertest')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const app = require('../app')
const subDao = require('../dao/subscriberDao')
const mock = require('./__mocks__/mockAxios')
const Subscriber = require('../models/Subscriber')
const Leaderboard = require('../models/Leaderboard')
const Player = require('../models/Player')
const config = require('../config')

dotenv.config()
const api = supertest(app)

beforeAll(async () => mongoose.connect(config.MONGODB_URI))

describe('Discord interactions tests', () => {
  let mockCommand = {
    id: 'mockInteractionId',
    guild_id: 'mockGuildId',
    data: {
      guild_id: 'mockGuildId',
    },
    member: {
      user: {
        username: 'mockUser',
        id: 'mockDiscordId',
      },
    },
    type: 2,
  }
  beforeEach(async () => {
    mockCommand = {
      id: 'mockInteractionId',
      guild_id: 'mockGuildId',
      data: {
        guild_id: 'mockGuildId',
      },
      member: {
        user: {
          username: 'mockUser',
          id: 'mockDiscordId',
        },
      },
      type: 2,
    }
    await Subscriber.deleteMany({})
  })

  afterEach(() => {
    mock.resetHistory()
  })

  test('Api responds to verification requests', async () => {
    mockCommand.type = 1
    const res = await api.post('/interactions').send(mockCommand)
    expect(res.status).toBe(200)
    expect(res.body.type).toBe(1)
  })

  test('Api responds correctly to illegal path', async () => {
    const res = await api.get('/bad')

    expect(res.status).toBe(404)
  })

  describe('Interactions', () => {
    test('Api responds correctly to /echo', async () => {
      mockCommand.data.name = 'misc'
      mockCommand.data.options = [
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'echo',
          options: [
            {
              name: 'message',
              type: 3,
              value: 'moi',
            },
          ],
        },
      ]
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
          value: 'mockValue',
        },
        {
          name: 'end',
          type: 3,
          value: 'mockValue',
        },
      ]
      mockCommand.data.options = options
      const res = await api.post('/interactions').send(mockCommand)

      expect(res.body.data.content).not.toBe('Route not found')
      expect(res.status).toBe(200)
    })

    test('Api responds correctly to /ping', async () => {
      mockCommand.data.name = 'misc'
      mockCommand.data.options = [
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'ping',
        },
      ]
      const res = await api.post('/interactions').send(mockCommand)
      expect(res.body.data.content).toBe('pong')
      expect(res.status).toBe(200)
    })

    test('Api responds correctly to /pp', async () => {
      mockCommand.data.name = 'misc'
      mockCommand.data.options = [
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'pp',
          options: [],
        },
      ]
      const res = await api.post('/interactions').send(mockCommand)
      expect(res.body.data.content).toMatch(/B=*D/)
      expect(res.status).toBe(200)
    })

    test('Api responds correctly to /weather 24h', async () => {
      mockCommand.data.name = 'weather'
      mockCommand.data.options = [
        {
          name: '24h',
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: 'query',
              type: 3,
              value: 'mockValue',
            },
          ],
        },
      ]

      const res = await api.post('/interactions').send(mockCommand)
      expect(res.body.data.embeds).toBeDefined()
      expect(res.status).toBe(200)
    })

    test('Api responds correctly to /weather current', async () => {
      mockCommand.data.name = 'weather'
      mockCommand.data.options = [
        {
          name: 'current',
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: 'query',
              type: 3,
              value: 'mockValue',
            },
          ],
        },
      ]

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
          value: 'mockValue',
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
      await subDao.removeAll()
    })

    test('Api responds correctly to /unsubscribe', async () => {
      const mockUser = {
        username: 'mockUser',
        discordid: 'mockDiscordId',
        cities: 'mockValue',
        utcOffset: 0,
        dmChannel: 'mockChannelId',
      }
      const sub = new Subscriber(mockUser)
      await sub.save()
      mockCommand.data.name = 'unsubscribe'
      const res = await api.post('/interactions').send(mockCommand)

      expect(res.body.data.content).toBe('Unsubscribed!')
    })

    test('Api responds correctly to /remindme', async () => {
      mockCommand.data.name = 'remindme'
      mockCommand.data.options = [
        {
          type: 3,
          name: 'time',
          value: '5 seconds',
        },
      ]
      const res = await api.post('/interactions').send(mockCommand)
      expect(res.body.data.content).toBe('I will remind you in 5 seconds')
      expect(mock.history.post[0].url).toBe(
        'https://discord.com/api/v10/users/@me/channels',
      )
    })

    test('Api responds correctly to /challenge', async () => {
      mockCommand.data.name = 'challenge'
      mockCommand.data.options = [
        {
          type: ApplicationCommandOptionType.User,
          name: 'username',
          value: 'mockUser2',
        },
      ]

      const res = await api.post('/interactions').send(mockCommand)
      expect(res.body.data.content).toContain('mockUser2')
      expect(res.body.data.content).toContain('mockDiscordId')
    })

    describe('Esportal commands', () => {
      beforeEach(async () => {
        const lb = new Leaderboard({
          guildId: 'mockGuildId',
          channelId: 'mockChannelId',
          messageId: 'mockMessageId',
        })
        const saved = await lb.save()
        const player = new Player({
          name: 'mockPlayer',
          guildId: 'mockGuildId',
          leaderboard: saved._id,
        })
        const pl = await player.save()
        saved.players = saved.players.concat(pl._id)
        await lb.save()
      })

      afterEach(async () => {
        await Leaderboard.deleteMany({})
        return Player.deleteMany({})
      })

      test('/stats', async () => {
        mockCommand.data.name = 'esportal'
        mockCommand.data.type = 2
        mockCommand.data.options = [
          {
            type: 1,
            name: 'stats',
            options: [
              {
                type: 3,
                name: 'player',
                value: 'mockPlayer',
              },
            ],
          },
        ]

        const res = await api.post('/interactions').send(mockCommand)
        expect(res.body.data.embeds).toBeDefined()
        expect(res.status).toBe(200)
      })

      test('/Leaderboard create', async () => {
        await Leaderboard.deleteMany({})
        mockCommand.data.name = 'esportal'
        mockCommand.data.type = 2
        mockCommand.data.options = [
          {
            type: 2,
            name: 'leaderboard',
            options: [
              {
                type: 1,
                name: 'create',
                options: [
                  {
                    type: 3,
                    name: 'channel',
                    value: 'mockChannelId',
                  },
                ],
              },
            ],
          },
        ]
        const res = await api.post('/interactions').send(mockCommand)
        expect(res.body.data.content).toBe('Leaderboard created!')
        const lb = await Leaderboard.findOne({ guildId: 'mockGuildId' })
        expect(lb).not.toBe(null)
      })

      test('/Leaderboard add', async () => {
        await Player.deleteMany({})
        mockCommand.data.name = 'esportal'
        mockCommand.data.type = 2
        mockCommand.data.options = [
          {
            type: 2,
            name: 'leaderboard',
            options: [
              {
                type: 1,
                name: 'add',
                options: [
                  {
                    type: 3,
                    name: 'player',
                    value: 'mockPlayer',
                  },
                ],
              },
            ],
          },
        ]
        const res = await api.post('/interactions').send(mockCommand)
        expect(res.body.data.content).toBe('Added player mockPlayer')
        const lb = await Leaderboard.findOne({
          guildId: 'mockGuildId',
        }).populate('players')
        expect(lb.players[0].name).toBe('mockPlayer')
      })

      test('/Leaderboard current', async () => {
        mockCommand.data.name = 'esportal'
        mockCommand.data.type = 2
        mockCommand.data.options = [
          {
            type: 2,
            name: 'leaderboard',
            options: [
              {
                type: 1,
                name: 'current',
              },
            ],
          },
        ]
        const res = await api.post('/interactions').send(mockCommand)
        expect(res.body.data.embeds).toBeInstanceOf(Object)
      })

      test('/Leaderboard remove', async () => {
        mockCommand.data.name = 'esportal'
        mockCommand.data.type = 2
        mockCommand.data.options = [
          {
            type: 2,
            name: 'leaderboard',
            options: [
              {
                type: 1,
                name: 'remove',
                options: [
                  {
                    type: 3,
                    name: 'player',
                    value: 'mockPlayer',
                  },
                ],
              },
            ],
          },
        ]
        const res = await api.post('/interactions').send(mockCommand)
        expect(res.body.data.content).toBe('Removed player mockPlayer')
        const lb = await Leaderboard.findOne({ guildId: 'mockGuildId' })
        expect(lb.players.length).toBe(0)
      })

      test('/Leaderboard delete', async () => {
        mockCommand.data.name = 'esportal'
        mockCommand.data.type = 2
        mockCommand.data.options = [
          {
            type: 2,
            name: 'leaderboard',
            options: [
              {
                type: 1,
                name: 'delete',
              },
            ],
          },
        ]
        const res = await api.post('/interactions').send(mockCommand)
        expect(res.body.data.content).toBe('Removed leaderboard')
        const lb = await Leaderboard.findOne({ guildId: 'mockGuildId' })
        expect(lb).toBe(null)
      })
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
        mockCommand.data.options = [
          {
            name: '24h',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
              {
                name: 'query',
                type: 3,
                value: 'incorrect',
              },
            ],
          },
        ]

        const res = await api.post('/interactions').send(mockCommand)
        expect(res.body.data.content).toBe('Weather not found with: incorrect')
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

        expect(res.body.data.content).toBe(
          'Subscription failed, reason: incorrect, 80:0, Offset should be between -12 and 14',
        )
        expect(res.status).toBe(200)
      })

      test('/remindme', async () => {
        mockCommand.data.name = 'remindme'
        mockCommand.data.options = [
          {
            type: 3,
            name: 'time',
            value: '1 hour second minute',
          },
        ]
        const res = await api.post('/interactions').send(mockCommand)
        expect(res.body.data.content).toBe('Invalid time')
        expect(mock.history.post[0].url).toBe(
          'https://discord.com/api/v10/users/@me/channels',
        )
      })
    })
  })
})

afterAll(async () => {
  await subDao.removeAll({})
  await Leaderboard.deleteMany({})
  await Player.deleteMany({})
})
