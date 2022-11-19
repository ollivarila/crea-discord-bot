/* eslint-disable no-underscore-dangle */
const { EmbedBuilder } = require('discord.js')
const Leaderboard = require('../models/Leaderboard')
const Player = require('../models/Player')
const { sendMessage, updateMessage, deleteMessage } = require('../utils/discordUtils')
const jobController = require('../controllers/jobController')
const { error } = require('../utils/logger')
const { request } = require('../utils/requests')

const leaderboard = {
  type: 1,
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

const getLeaderboardEmbed = leaderboardData => {
  const { name, players } = leaderboardData
  const sortedPlayers = [...players].sort((a, b) => a.elo - b.elo)
  // construct embed

  const embed = new EmbedBuilder()
  embed.setColor('#8a00c2')
    .setTitle(`${name} leaderboard`)
  let str = ''
  sortedPlayers.forEach((p, i) => {
    const kd = (p.kills / p.deaths).toFixed(2)
    str = str.concat(`${i + 1}. ${p.username} rank: ${p.elo} k/d: ${kd} mvps: ${p.mvps} matches: ${p.matches}\n`)
  })
  embed.setFields({ name: 'Leaderboard', value: str === '' ? 'empty' : str })
  embed.setFooter({ text: 'CreaBot' })
  return embed
}

const getPlayerData = async name => {
  const url = `https://esportal.com/api/user_profile/get?username=${name}`
  const res = await request(url, { method: 'get' })
  if (!res) {
    throw new Error(`Error getting data from esportal with name ${name}`)
  }
  return res.data
}

const getPlayersData = async (players) => {
  const playersData = []

  await Promise.all(players.map(async p => {
    const playerData = await getPlayerData(p.name)
    playersData.push(playerData)
  }))
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
    const res = updateMessage(lb.channelId, lb.messageId, { embeds: embed })

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
  // try to create leaderboard with channel id
    const lb = new Leaderboard({
      name,
      guildId,
      channelId,
    })
    // create job to update leaderboard
    jobController.createJob({
      time: '* 12 12 * * *',
      utcOffset: 0,
      id: guildId,
    }, updateLeaderboard)

    // construct embed
    const embed = getLeaderboardEmbed({ name, players: [] })

    // post leaderboard on channel
    const res = await sendMessage(channelId, embed)
    if (!res) {
      throw new Error('Error sending leaderboard to channel')
    }

    lb.messageId = res.data.id
    // save to db
    await lb.save()

    return 'Leaderboard created!'
  } catch (err) {
    error(err)
    jobController.removeJob(guildId)
    return err.message
  }
}

const addPlayer = async (guildId, playerName) => {
  try {
    // try to get data from esportal
    const data = await getPlayerData(playerName)

    if (!data) {
      throw new Error(`Could not find player with that name ${playerName}`)
    }

    const lb = await Leaderboard.findOne({ guildId })
    // create player and save to db
    // add player to leaderboard (db)

    const player = new Player({
      name: playerName,
      guildId,
    })
    const saved = await player.save()
    lb.players = lb.players.concat(saved._id)
    await lb.save()

    updateLeaderboard({ id: guildId })

    // return proper reply
    return `Added player ${playerName}`
  } catch (err) {
    error(err)
    return err.message
  }
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

  lb.players = lb.players.filter(p => p.name !== removed.name)
  await lb.save()
  // update leaderboard ?
  updateLeaderboard({ id: guildId })

  return `Removed player ${playerName}`
}

const currentLeaderboard = async guildId => {
  try {
    // Get leaderboard from db
    const lb = await Leaderboard.findOne({ guildId }).populate('players')
    const playersData = await getPlayersData(lb.players)
    return getLeaderboardEmbed({ name: lb.name, players: playersData })
  } catch (err) {
    error(err)
    return err.message
  }
}

const deleteLeaderboard = async guildId => {
  try {
    // remove leaderboard from db
    const removed = await Leaderboard.findOneAndRemove({ guildId }).populate('players')
    if (!removed) {
      throw new Error('Could not remove leaderboard')
    }
    // delete message
    await deleteMessage(removed.channelId, removed.messageId)

    // remove users
    await Promise.all(removed.players.map(p => Player.findByIdAndRemove(p._id)))
    return 'Removed leaderboard'
  } catch (err) {
    error(err)
    return err.message
  }
}

module.exports = {
  esportal,
  createLeaderboard,
  addPlayer,
  removePlayer,
  currentLeaderboard,
  deleteLeaderboard,
}
