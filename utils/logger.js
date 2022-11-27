/* eslint-disable no-console */
const chalk = require('chalk')

const { NODE_ENV } = process.env

const info = (...params) => {
  if (NODE_ENV !== 'test') {
    console.log(...params)
  }
}

const error = (...params) => {
  if (NODE_ENV !== 'test') {
    console.error(chalk.red(...params))
  }
}

module.exports = {
  info,
  error,
}
