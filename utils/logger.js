const logger = (req, res, next) => {
  console.log(`NEW REQUEST method: ${req.method} path: ${req.path}`)
  next()
}

export default logger