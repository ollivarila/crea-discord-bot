const logger = (req, res, next) => {
  console.log(`NEW REQUEST method: ${req.method} path: ${req.path}`)
  console.log('data: ', req.body.data)
  console.log('user:', `${req.body.member.user.username} id: ${req.body.member.user.id}`)

  console.log(req)
  //`${req.body.user.name} id: ${req.body.user.id}`
  //console.log('RESPONSE', res)
  next()
}

export default logger