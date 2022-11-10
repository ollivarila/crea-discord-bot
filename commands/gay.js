const GAY_COMMAND = {
  type: 1,
  name: 'gay',
  description: 'Find out how gay you are',
}

export const getAnswer = (user) => {
  const percentage = Math.floor(Math.random() * 100)
  return `${user} is ${percentage}% gay`
}

export default GAY_COMMAND