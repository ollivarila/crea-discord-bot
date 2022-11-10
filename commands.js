import { installCommand, discordRequest } from './utils/requests.js'

export async function HasGuildCommands(appId, guildId, commands) {
  if (guildId === '' || appId === '') return;

  commands.forEach((c) => HasGuildCommand(appId, guildId, c));
}

// Checks for a command
async function HasGuildCommand(appId, guildId, command) {
  // API endpoint to get and post guild commands
  const endpoint = `/applications/${appId}/guilds/${guildId}/commands`;

  try {
    const res = await discordRequest(endpoint, { method: 'get' });
    const data = res.data;

    if (data) {
      const installedNames = data.map((c) => c.name);
      // This is just matching on the name, so it's not good for updates
      if (!installedNames.includes(command.name)) {
        console.log(`Installing "${command.name}"`);
        InstallGuildCommand(command);
      } else {
        console.log(`"${command.name}" command already installed`);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

// Installs a command
export async function InstallGuildCommand(command) {
  try {
    await installCommand(command);
    console.log(`installed ${command.name}`)
  } catch (err) {
    console.log('error installing command ' + command.name)
    console.log(err);
  }
}
