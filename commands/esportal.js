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
  // construct embed
}

const constructLeaderboard = async guildId => {
  // get leaderboard from db (populated with players)

  // get player data

  // construct embed

}

const updateLeaderboard = async id => {
  // get leaderboard from db

  // get player data

  // construct embed

  // update leaderboard
}

const createLeaderboard = async channelId => {
  // try to create leaderboard with channel id

  // save to db

  // create job to update leaderboard

  // construct embed

  // post leadeboard on channel

}

const addPlayer = async (guildId, playerName) => {
  // try to get data from esportal

  // create player info and save to db

  // add player to leaderboard (db)

  // return proper reply
}

const removePlayer = async (guildId, playerName) => {
  // remove player from db

  // update leaderboard ?
}

const currentLeaderboard = async guildId => {
  // Get leaderboard from db

  //
}

const deleteLeaderboard = async guildId => {
  // remove leaderboard from db

  // delete message
}

module.exports = {
  esportal,
  createLeaderboard,
  addPlayer,
  removePlayer,
  currentLeaderboard,
  deleteLeaderboard,
}
