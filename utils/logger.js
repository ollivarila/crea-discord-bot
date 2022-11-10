const logger = (req, res, next) => {
  console.log(`NEW REQUEST method: ${req.method} path: ${req.path}`)
  console.log('BODY:', req.body)
  //console.log('RESPONSE', res)
  next()
}

export default logger