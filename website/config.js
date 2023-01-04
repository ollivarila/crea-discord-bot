const BACKEND_URL =
	process.env.NODE_ENV !== 'development'
		? 'https://crea-discord-bot.fly.dev'
		: 'http://localhost:3001'

const exports = { BACKEND_URL }

export default exports
