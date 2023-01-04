/* eslint-disable no-param-reassign */
const mongoose = require('mongoose')

const commandSchema = new mongoose.Schema({
	name: String,
	timesUsed: Number,
	commandId: String,
	guild: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'GuildStats',
	},
})

commandSchema.set('toJSON', {
	transform: (doc, retObj) => {
		retObj.id = retObj._id.toString()
		delete retObj._id
		delete retObj.__v
	},
})

module.exports = mongoose.model('Command', commandSchema)
