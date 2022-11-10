const logger = (req, res, next) => {
  console.log(`NEW REQUEST method: ${req.method} path: ${req.path}`)
  console.log(req)
  next()
}

export default logger