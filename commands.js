import { installCommand, discordRequest } from './utils/requests.js'

export async function HasGuildCommands(appId, guildId, commands) {
  if (guildId === '' || appId === '') return;

  const endpoint = `/applications/${appId}/guilds/${guildId}/commands`;
  const res = await discordRequest(endpoint, { method: 'get' });
  const data = res.data;

  for(const command of commands){
    await HasGuildCommand(data, command)
  }
}

// Checks for a command
async function HasGuildCommand(data, command) {
  // API endpoint to get and post guild commands
  try {
    if (data) {
      const installedNames = data.map((c) => c.name);
      // This is just matching on the name, so it's not good for updates
      if (!installedNames.includes(command.name)) {
        console.log(`Installing "${command.name}"`);
        await InstallGuildCommand(command);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

// Installs a command
export async function InstallGuildCommand(command) {
  const res = await installCommand(command);
  console.log(`installed ${command.name}`)
}
