import logger from "./logger.js"

const requestMiddleware = (req, res, next) => {
  try {
    if(req.body){
      const body = req.body
      req.interaction = {
        options: body.data.options,
        type: body.type,
        id: body.id,
        user: body.member.user
      }
    }
    logger.info('requestMiddleware: ', req.interaction)
  } catch (error) {
    logger.error('no body on request')
  }
  next()
}

export default requestMiddleware