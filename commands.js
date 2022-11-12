const { installCommand, discordGet } = require('./utils/requests.js')

async function HasGuildCommands(appId, guildId, commands) {
  if (guildId === '' || appId === '') return;

  const endpoint = `/applications/${appId}/guilds/${guildId}/commands`;
  const res = await discordGet(endpoint, {});
  const data = res.data;

  for(const command of commands){
    await HasGuildCommand(data, command)
  }
}

// Checks for a command
async function HasGuildCommand(data, command) {
  // API endpoint to get and post guild commands
    if (data) {
      const installedNames = data.map((c) => c.name);
      // This is just matching on the name, so it's not good for updates
      if (!installedNames.includes(command.name)) {
        console.log(`Installing "${command.name}"`);
        await InstallGuildCommand(command);
      }
    }
}

// Installs a command
async function InstallGuildCommand(command) {
  const res = await installCommand(command);
  console.log(`installed ${command.name}`)
}

module.exports = {
  HasGuildCommands,
  InstallGuildCommand
}
