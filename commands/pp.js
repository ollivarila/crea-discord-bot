const pp = {
  type: 1,
  name: 'pp',
  description: 'Find out how long your pp is',
  options: [
    {
      type: 3,
      name: 'user',
      description: 'Name of the user how is measured',
    }
  ]
}

const getPP = (user) => {
  const MIN = 1
  const MAX = 12
  let ppString = `${user}'s pp: B=` 
  const size = Math.floor((Math.random() * MAX) + MIN)
  for(let i = 0; i < size; i++){
    ppString += '='
  }
  ppString += 'D'
  return ppString
}

module.exports = {
  pp,
  getPP
}