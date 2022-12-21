/* eslint-disable no-underscore-dangle */
const { EmbedBuilder } = require('discord.js')
const Leaderboard = require('../models/Leaderboard')
const Player = require('../models/Player')
const {
	sendMessage,
	updateMessage,
	deleteMessage,
} = require('../utils/discordUtils')
const jobController = require('../controllers/jobController')
const { info, error } = require('../utils/logger')
const { request } = require('../utils/requests')

const leaderboard = {
	type: 2,
	name: 'leaderboard',
	description: 'Esportal leaderboard',
	options: [
		{
			type: 1,
			name: 'create',
			description: 'creates leaderboard',
			options: [
				{
					type: 3,
					name: 'channel',
					description: 'id of the channel where leaderboard will be created',
					required: true,
				},
			],
		},
		{
			type: 1,
			name: 'remove',
			description: 'remove player from leaderboard',
			options: [
				{
					type: 3,
					name: 'player',
					description: 'name of the player to remove',
					required: true,
				},
			],
		},
		{
			type: 1,
			name: 'add',
			description: 'add player to leaderboard',
			options: [
				{
					type: 3,
					name: 'player',
					description: 'name of the player to add',
					required: true,
				},
			],
		},
		{
			type: 1,
			name: 'current',
			description: 'displays current leaderboard',
		},
		{
			type: 1,
			name: 'delete',
			description: 'removes leaderboard',
		},
	],
}

const stats = {
	type: 1,
	name: 'stats',
	description: 'get statistics of a player',
	options: [
		{
			type: 3,
			name: 'player',
			description: 'name of the player in esportal',
			required: true,
		},
	],
}

const esportal = {
	type: 1,
	name: 'esportal',
	description: 'Esportal commands',
	options: [
		leaderboard, // Subcommand /esportal leaderboard
		stats, // Subcommand /esportal stats
	],
}

const rankToEmoji = rank => {
	const rankFloor = Math.floor(rank / 100) * 100
	const ranks = {
		1400: '🧢',
		1500: '🥶',
		1600: '🥵',
		1700: '🤬',
		1800: '👿',
		1900: '😈',
		2000: '💣',
	}
	return ranks[rankFloor]
}

const getLeaderboardEmbed = leaderboardData => {
	const { name, players } = leaderboardData
	const sortedPlayers = [...players].sort((a, b) => b.elo - a.elo)

	// construct embed
	const embed = new EmbedBuilder()
	embed.setColor('#8a00c2').setTitle(`${name} leaderboard`)
	let str = ''
	sortedPlayers.forEach((p, i) => {
		const kd = (p.kills / p.deaths).toFixed(2)
		const mvpP = ((p.mvps / p.matches) * 100).toFixed(2)
		str = str.concat(
			`**${i + 1}**. ${p.username} elo: ${p.elo} ${rankToEmoji(
				p.elo,
			)} k/d: ${kd} mvp (%): ${mvpP}\n\n`,
		)
	})
	embed.setFields({ name: 'Leaderboard', value: str === '' ? 'empty' : str })
	embed.setFooter({ text: 'CreaBot' }).setTimestamp()
	return embed
}

const getPlayerData = async name => {
	const url = `https://esportal.com/api/user_profile/get?username=${name}`
	return request(url, { method: 'get' })
}

const getRecentMatches = async id => {
	const url = `https://esportal.com/api/user_profile/get_latest_matches?id=${id}&page=1&v=2`
	return request(url, { method: 'get' })
}

const getPlayersData = async players => {
	const playersData = []

	await Promise.all(
		players.map(async p => {
			const playerData = await getPlayerData(p.name)
			if (playerData) playersData.push(playerData)
		}),
	)
	return playersData
}

const updateLeaderboard = async data => {
	const { id } = data

	try {
		// get leaderboard from db
		const lb = await Leaderboard.findOne({ guildId: id }).populate('players')
		const { players } = lb
		// get player data
		const playersData = await getPlayersData(players)
		// construct embed
		const embed = getLeaderboardEmbed({ name: lb.name, players: playersData })
		// update leaderboard
		const res = updateMessage(lb.channelId, lb.messageId, { embeds: [embed] })

		if (!res) {
			throw new Error('Error updating leaderboard message')
		}
	} catch (err) {
		error(err)
		jobController.removeJob(id)
		return err.message
	}
}

const createLeaderboard = async (guildId, channelId, name = 'Esportal') => {
	try {
		const found = await Leaderboard.findOne({ guildId })
		if (found) {
			throw new Error('Guild already has a leaderboard')
		}
		// try to create leaderboard with channel id
		const lb = new Leaderboard({
			name,
			guildId,
			channelId,
		})
		// create job to update leaderboard
		jobController.createJob(
			{
				time: '0 0 17-23,0 * * *',
				utcOffset: 2,
				id: guildId,
			},
			updateLeaderboard,
		)

		// construct embed
		const embed = getLeaderboardEmbed({ name, players: [] })

		// post leaderboard on channel
		const data = await sendMessage(channelId, { embeds: [embed] })
		if (!data) {
			throw new Error('Error sending leaderboard to channel')
		}

		lb.messageId = data.id
		// save to db
		await lb.save()

		return 'Leaderboard created!'
	} catch (err) {
		error(err.message)
		jobController.removeJob(guildId)
		return err.message
	}
}

const addPlayer = async (guildId, playerName) => {
	const found = await Player.findOne({ name: playerName })
	if (found && found.guildId === guildId)
		return 'Player already added to the leaderboard'
	// try to get data from esportal
	const data = await getPlayerData(playerName)

	if (!data) return 'Name might be invalid'

	const lb = await Leaderboard.findOne({ guildId })
	// create player and save to db
	// add player to leaderboard (db)

	const player = new Player({
		name: playerName,
		guildId,
		leaderboard: lb._id,
	})

	try {
		const saved = await player.save()
		lb.players = lb.players.concat(saved._id)
		await lb.save()
	} catch (err) {
		error('Error saving player to database')
		return 'Error saving player'
	}

	updateLeaderboard({ id: guildId })

	// return proper reply
	return `Added player ${playerName}`
}

const removePlayer = async (guildId, playerName) => {
	// remove player from db
	const found = await Player.find({ name: playerName })
	const player = found.filter(p => p.guildId === guildId).pop()

	if (!player) {
		return 'Player not found'
	}

	const lb = await Leaderboard.findById(player.leaderboard).populate('players')
	const removed = await Player.findByIdAndRemove(player._id)

	if (!removed) {
		return 'Player not found'
	}

	lb.players = lb.players.filter(p => p.name !== playerName)
	await lb.save()

	updateLeaderboard({ id: guildId })

	return `Removed player ${playerName}`
}

const currentLeaderboard = async guildId => {
	// Get leaderboard from db
	const lb = await Leaderboard.findOne({ guildId }).populate('players')

	if (!lb) {
		return { content: 'Leaderboard not found' }
	}

	const playersData = await getPlayersData(lb.players)
	const embed = getLeaderboardEmbed({ name: lb.name, players: playersData })
	updateMessage(lb.channelId, lb.messageId, { embeds: [embed] })
	return { embeds: [embed] }
}

const deleteLeaderboard = async guildId => {
	// remove leaderboard from db
	const removed = await Leaderboard.findOneAndRemove({ guildId }).populate(
		'players',
	)
	if (!removed) return 'Did not find a leaderboard to remove'
	// delete message
	await deleteMessage(removed.channelId, removed.messageId)
	// remove users
	await Promise.all(removed.players.map(p => Player.findByIdAndRemove(p._id)))
	return 'Removed leaderboard'
}

const setUpLeaderboards = async () => {
	const leaderboards = await Leaderboard.find({})
	leaderboards.forEach(lb => {
		jobController.createJob(
			{
				time: '0 0 17-23,0 * * *',
				utcOffset: 2,
				id: lb.guildId,
			},
			updateLeaderboard,
		)
	})
	info('Leaderboards set up')
}

const parseRecentMatches = matches => {
	let eloChange = 0
	let recentKills = 0
	let recentDeaths = 0
	let totalMatches = 0
	let totalWins = 0

	matches.forEach(m => {
		eloChange += m.elo_change
		recentKills += m.stats.kills
		recentDeaths += m.stats.deaths
		if (m.winner) {
			totalWins++
		}
		totalMatches++
	})

	return {
		eloChange,
		recentKd: (recentKills / recentDeaths).toFixed(2),
		recentWinrate: ((totalWins / totalMatches) * 100).toFixed(2),
	}
}

const getStatsEmbed = async player => {
	const data = await getPlayerData(player)
	const matches = await getRecentMatches(data.id)

	if (!data) {
		return { content: 'Could not find player' }
	}
	if (!matches) {
		return { content: 'Could not get recent matches' }
	}
	const { eloChange, recentKd, recentWinrate } = parseRecentMatches(matches)

	const kd = (data.kills / data.deaths).toFixed(2)
	const winrate = ((data.wins / (data.wins + data.losses)) * 100).toFixed(2)

	const embed = new EmbedBuilder()
	embed
		.setTitle(`${data.username} stats`)
		.addFields(
			{
				name: 'Elo',
				value: `${data.elo} ${rankToEmoji(data.elo)}`,
				inline: true,
			},
			{ name: 'K/D', value: `${kd}`, inline: true },
			{ name: 'Winrate', value: `${winrate} %`, inline: true },
		)
		.addFields({
			name: 'Recent 9 games',
			value: `
        Elo change: ${eloChange} ${eloChange < 0 ? '🤡' : '🟢'}
        K/D: ${recentKd}
        Winrate: ${recentWinrate} %
        `,
		})
		.setThumbnail(
			`https://avatars.steamstatic.com/${data.avatar_hash}_medium.jpg`,
		)
		.setURL(`https://esportal.com/en/profile/${data.username}`)
		.setFooter({ text: 'CreaBot' })
		.setTimestamp()
		.setColor('#8a00c2')
	return { embeds: [embed] }
}

module.exports = {
	esportal,
	createLeaderboard,
	addPlayer,
	removePlayer,
	currentLeaderboard,
	deleteLeaderboard,
	setUpLeaderboards,
	getStatsEmbed,
}
