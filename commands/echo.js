const echo = {
  type: 1,
  name: 'echo',
  description: 'echo whatever you say',
  options: [
    {
      type: 3,
      name: 'message',
      description: 'message',
      required: 'true',
    },
  ],
}

module.exports = {
  echo,
}
