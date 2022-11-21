const logger = require('./logger')
require('dotenv').config()

const loggerMiddleware = (req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    logger.info(`NEW REQUEST method: ${req.method} path: ${req.path}`)
    if (req.path === '/interactions') {
      try {
        logger.info(`user: ${req.user.username} used: /${req.commandName}`)
      } catch (error) {
        next()
      }
    }
  }
  next()
}

module.exports = loggerMiddleware
