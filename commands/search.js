const search = {
  type: 1,
  name: 'search',
  description: 'search the web',
  options: [
    {
      type: 3,
      name: 'query',
      description: 'query',
      required: true
    }
  ]
}

const createUrl = q => {
  const baseUrl = 'https://www.google.com/search?q='
  return `${baseUrl}${q}`
}

module.exports = {
  search,
  createUrl
}