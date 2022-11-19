/* eslint-disable */
const mock = require('../__mocks__/mockAxios')
const { default: mongoose } = require('mongoose')
const {
  addPlayer, createLeaderboard, deleteLeaderboard, currentLeaderboard, removePlayer,
} = require('../../commands/esportal')
const Leaderboard = require('../../models/Leaderboard')
const Player = require('../../models/Player')
const config = require('../../config')
const jobController = require('../../controllers/jobController')

describe('Esportal command tests', () => {
  
  beforeAll(async () => {
    return mongoose.connect(config.MONGODB_URI)
  })
  beforeEach(async () => {
    const mockLb = new Leaderboard({
      guildId: 'mockGuildId',
      channelId: 'mockChannelId',
      messageId: 'mockMessageId',
    })
    const savedLb = await mockLb.save()
    const mockPlayer = new Player({
      name: 'mockUser',
      leaderboard: savedLb._id,
      stats: 'mockStats'
    })
    const savedPlayer = await mockPlayer.save()
    savedLb.players = savedLb.players.concat(savedPlayer._id)
    const res = await savedLb.save()
  })

  afterEach(async () => {
    await Leaderboard.deleteMany({})
    await Player.deleteMany({})
    jobController.stopAll()
  })

  test('Leaderboard creation', async () => {
    const reply = await createLeaderboard('mockGuildId2', 'mockChannelId')
    const lbFromDb = await Leaderboard.findOne({ guildId: 'mockGuildId2' })
    expect(lbFromDb.guildId).toBe('mockGuildId2')
    expect(reply).toBe('Leaderboard created!')
  })

  test('Adding player to leaderboard', async () => {
    const reply = await addPlayer('mockGuildId', 'mockPlayer')
    const lbFromDb = await Leaderboard.findOne({ guildId: 'mockGuildId' })
    expect(reply).toBe('Added player mockPlayer')
    expect(lbFromDb.players.length).toBe(2)
  })

  test('Removing player from leaderboard', async () => {
    const removed = await removePlayer('mockId', 'mockUser')
    const lbFromDb = await Leaderboard.findOne({ guildId: 'mockGuildId' })
    expect(removed).toBe('Removed player mockUser')
    expect(lbFromDb.players.length).toBe(0)
  })

  test('Getting current leaderboard', async () => {
    const embed = await currentLeaderboard('mockId')
    console.log(embed)
    expect(embed).toBeInstanceOf(Object)
  })

  test('Deleting leaderboard', async () => {
    const reply = await deleteLeaderboard('mockId')
    const lbFromDb = await Leaderboard.findOne({ guildId: 'mockId' })
    expect(lbFromDb).toBe(null)
    expect(reply).toBe('Removed leaderboard')
  })
})
