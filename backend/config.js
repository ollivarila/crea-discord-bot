/* eslint-disable no-nested-ternary */
const dotenv = require('dotenv')

dotenv.config()

const MONGODB_URI =
	process.env.NODE_ENV === 'test'
		? process.env.TEST_MONGODB_URI
		: process.env.NODE_ENV === 'development'
		? process.env.MONGODB_URI
		: process.env.DEV_MONGODB_URI

module.exports = {
	MONGODB_URI,
}
