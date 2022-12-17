const dotenv = require('dotenv')
const { discordRequest } = require('./requests')
const commands = require('../commands')
const { error, info } = require('./logger')

dotenv.config()

const updateGlobalCommands = async () => {
	const endpoint = `/applications/${process.env.APPID}/commands`
	info('Updating commands...')

	const updatedCommands = await discordRequest(endpoint, {
		method: 'put',
		data: commands,
	})

	if (!updatedCommands) {
		error('Error updating commands')
		process.exit(1)
	}

	if (updatedCommands.length === commands.length) {
		info('Commands updated succesfully!')
	}
	process.exit(0)
}

updateGlobalCommands()
