const mongoose = require('mongoose')
const { setUpLeaderboards } = require('../commands/esportal')
const { setUpSubscriptions } = require('../commands/subscribe')
const config = require('../config')
const { info, error } = require('./logger')

const connectDb = async () =>
	mongoose
		.connect(config.MONGODB_URI)
		.then(() => {
			info('Connected to MongoDB')
		})
		.catch(err => error('Error connecting to MongoDB', err))

const onStartUp = async () => {
	await connectDb()
	if (process.env.NODE_ENV === 'production') {
		await setUpSubscriptions()
		await setUpLeaderboards()
	}
}

module.exports = onStartUp
