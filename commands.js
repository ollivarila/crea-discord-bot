const { installCommand, discordRequest } = require('./utils/requests')

// Installs a command
async function InstallGuildCommand(command) {
  await installCommand(command);
}

// Checks for a command
async function HasGuildCommand(data, command) {
  // API endpoint to get and post guild commands
  if (data) {
    const installedNames = data.map((c) => c.name);
    // This is just matching on the name, so it's not good for updates
    if (!installedNames.includes(command.name)) {
      await InstallGuildCommand(command);
    }
  }
}

async function HasGuildCommands(appId, guildId, commands) {
  if (guildId === '' || appId === '') return

  const endpoint = `/applications/${appId}/guilds/${guildId}/commands`
  const res = await discordRequest(endpoint, { method: 'get' })
  const { data } = res

  for (const command of commands) {
    HasGuildCommand(data, command)
  }
}

module.exports = {
  HasGuildCommands,
  InstallGuildCommand,
}
