/* eslint-disable no-param-reassign */
const mongoose = require('mongoose')

const statsSchema = new mongoose.Schema({
	guildId: String,
	uptime: Date,
	users: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	],
	commandsUsed: Number,
	commands: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Command',
		},
	],
})

statsSchema.set('toJSON', {
	transform: (doc, retObj) => {
		retObj.id = retObj._id.toString()
		delete retObj._id
		delete retObj.__v
	},
})

module.exports = mongoose.model('GuildStats', statsSchema)
