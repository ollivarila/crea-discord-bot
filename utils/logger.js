const config = require('../config')
const NODE_ENV = process.env.NODE_ENV


const info = (...params) => {
  if(NODE_ENV !== 'test'){
    console.log(...params)
  }
}

const error = (...params) => {
  if(NODE_ENV !== 'test'){
    console.error(...params)
  }
}

module.exports = {
  info,
  error
}