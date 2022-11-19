/* eslint-disable */
const { default: mongoose } = require('mongoose')
const {
  addPlayer, createLeaderboard, deleteLeaderboard, currentLeaderboard, removePlayer,
} = require('../../commands/esportal')
const Leaderboard = require('../../models/Leaderboard')
const Player = require('../../models/Player')
const config = require('../../config')

describe('Esportal command tests', () => {
  
  beforeAll(async () => {
    return mongoose.connect(config.MONGODB_URI)
  })

  beforeEach(async () => {
    const mockLb = new Leaderboard({
      guildId: 'mockId'
    })
    const savedLb = await mockLb.save()
    const mockPlayer = new Player({
      name: 'mockUser',
      leaderboard: savedLb._id,
      stats: 'mockStats'
    })
    await mockPlayer.save()
  })

  afterEach(async () => {
    await Leaderboard.deleteMany({})
    await Player.deleteMany({})
  })

  test('Leaderboard creation', async () => {
    const embed = await createLeaderboard('123')
    const lbFromDb = await Leaderboard.findOne({ guildId: '123' })

    expect(lbFromDb.guildId).toBe('123')
    expect(embed).toBeInstanceOf(Object)
  })

  test('Adding player to leaderboard', async () => {
    const reply = await addPlayer('mockId', 'test')
    const lbFromDb = await Leaderboard.findOne({ guildId: 'mockId' })

    expect(reply).toBe('Added player test')
    expect(lbFromDb.players.length).toBe(2)
  })

  test('Removing player from leaderboard', async () => {
    const removed = await removePlayer('mockId', 'mockUser')
    const lbFromDb = await Leaderboard.findOne({ guildId: 'mockId' })
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
