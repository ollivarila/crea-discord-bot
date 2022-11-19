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

module.exports = {
  esportal,
}
