/* eslint-disable no-undef */
const { recordStatistics } = require('../../controllers/statsController')
const User = require('../../models/User')
const GuildStats = require('../../models/GuildStats')
const Command = require('../../models/Command')
const { createConnection } = require('../../utils/misc')

describe('StatsController', () => {
	beforeAll(async () => {
		createConnection()
		await User.deleteMany({})
		await GuildStats.deleteMany({})
		await Command.deleteMany({})
	})

	test('Initial creation', async () => {
		const mockRequest = {
			body: {
				member: {
					user: {
						username: 'mockUser',
					},
				},
			},
			guildId: 'mockGuildId',
			discordId: 'mockDiscordId',
			commandName: 'mockCommand',
		}
		const mockNext = jest.fn()
		await recordStatistics(mockRequest, {}, mockNext)

		const guild = await GuildStats.findOne({ guildId: mockRequest.guildId })
		const user = await User.findOne({ discordId: mockRequest.discordId })
		const command = await Command.findOne({ name: mockRequest.commandName })

		const notThis = null
		expect(guild).not.toBe(notThis)
		expect(user).not.toBe(notThis)
		expect(command).not.toBe(notThis)
		expect(mockNext).toHaveBeenCalled()
	})

	test('Stats are recorded correctly', async () => {
		const mockRequest = {
			guildId: 'mockGuildId',
			discordId: 'mockDiscordId',
			commandName: 'mockCommand',
			user: {
				username: 'mockUser',
			},
		}

		const mockNext = jest.fn()
		await recordStatistics(mockRequest, {}, mockNext)

		const guild = await GuildStats.findOne({ guildId: mockRequest.guildId })
		const user = await User.findOne({ discordId: mockRequest.discordId })
		const command = await Command.findOne({ name: mockRequest.commandName })

		expect(guild.commandsUsed).toBe(2)
		expect(user.commandsUsed).toBe(2)
		expect(command.timesUsed).toBe(2)
	})

	afterAll(async () => {
		await User.deleteMany({})
		await GuildStats.deleteMany({})
		await Command.deleteMany({})
	})
})
