const GuildStats = require('../models/GuildStats')
const User = require('../models/User')
const Command = require('../models/Command')
const { error } = require('../utils/logger')

const createGuildStats = async guildId => {
	const newGuildStats = new GuildStats({
		guildId,
		uptime: new Date(),
		commandsUsed: 0,
	})
	return newGuildStats.save()
}

const createUser = async (name, discordId, guild) => {
	const newUser = new User({
		name,
		discordId,
		commandsUsed: 0,
		guild,
	})
	return newUser.save()
}

const createCommand = async (name, guild) => {
	const newCommand = new Command({
		name,
		timesUsed: 0,
		guild,
	})
	return newCommand.save()
}

const recordStatistics = async (req, res, next) => {
	if (req.iType === 1) next()

	const statsExist = await GuildStats.findOne({ guildId: req.guildId })

	const gs = statsExist || (await createGuildStats(req.guildId))

	if (!gs) {
		error('Guildstats not found')
		next()
	}

	const userExists = await User.findOne({ discordId: req.discordId })

	const user =
		userExists ||
		(await createUser(req.body.member.user.username, req.discordId, gs._id))

	if (!user) {
		error('User not found')
		next()
	}

	const commandExists = await Command.findOne({ name: req.commandName })

	const command =
		commandExists || (await createCommand(req.commandName, gs._id))

	if (!command) {
		error('Command not found')
		next()
	}

	gs.commandsUsed += 1
	command.timesUsed += 1
	user.commandsUsed += 1

	if (!gs.users.includes(user._id)) {
		gs.users = [...gs.users, user._id]
	}

	if (!gs.commands.includes(command._id)) {
		gs.commands = [...gs.commands, command._id]
	}

	await gs.save()
	await command.save()
	await user.save()

	next()
}

module.exports = {
	recordStatistics,
}
