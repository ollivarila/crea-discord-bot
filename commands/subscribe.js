const subscribe = {
  type: 1,
  name: 'subscribe',
  description: 'Subscribe to weather forecast updates',
  options: [
    {
      type: 3,
      name: 'query',
      description: 'Names of cities separated by a comma i.e espoo, helsinki... ',
      required: true
    },
    {
      type: 3,
      name: 'time',
      description: 'Time when the forecast is sent',
    },
    {
      type: 3,
      name: 'timezone',
      description: 'timezone',
    }
  ]
}