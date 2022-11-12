const gay = {
  type: 1,
  name: 'gay',
  description: 'Find out how gay you are',
}

const getAnswer = (user) => {
  const percentage = Math.floor(Math.random() * 100)
  return `${user} is ${percentage}% gay`
}

module.exports = {
  gay,
  getAnswer
}