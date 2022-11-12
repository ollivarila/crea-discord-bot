const logger = require('./logger.js')
require('dotenv').config()

const loggerMiddleware = (req, res, next) => {
  if(process.env.NODE_ENV !== 'test'){
    logger.info(`NEW REQUEST method: ${req.method} path: ${req.path}`)
  }
  next()
}

module.exports = loggerMiddleware