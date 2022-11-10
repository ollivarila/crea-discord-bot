import logger from "./logger.js"

const loggerMiddleware = (req, res, next) => {
  logger.info(`NEW REQUEST method: ${req.method} path: ${req.path}`)
  next()
}

export default loggerMiddleware