const { capitalize } = require('../utils')
const { request } = require('../utils/requests')
const { error } = require('../utils/logger')

const route = {
  type: 1,
  name: 'route',
  description: 'find hsl route',
  options: [
    {
      type: 3,
      name: 'start',
      description: 'starting address',
      required: true,
    },
    {
      type: 3,
      name: 'end',
      description: 'ending address',
      required: true,
    },
  ],
}

const routeBaseUrl = 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql'
const addressToCoordsBaseUrl = 'https://api.digitransit.fi/geocoding/v1/search'

const addressToCoords = async (locations) => {
  try {
    const { start, end } = locations
    const url = `${addressToCoordsBaseUrl}?text=`
    let res = await request(url + start, { method: 'get' })
    const coordsStart = res.data.features[0].geometry.coordinates

    res = await await request(url + end, { method: 'get' })
    const coordsEnd = res.data.features[0].geometry.coordinates

    return {
      start: {
        lat: coordsStart[1],
        lon: coordsStart[0],
      },
      end: {
        lat: coordsEnd[1],
        lon: coordsEnd[0],
      },
    }
  } catch (err) {
    error(err)
    return null
  }
}

const getRouteString = (itinerary) => {
  let str = ''
  itinerary.forEach((waypoint, i) => {
    const temp = `${i + 1}. ${capitalize(waypoint.mode)}, from ${waypoint.from} to ${waypoint.to} \n`
    str += temp
  })
  return str
}

const getRoute = async (locations) => {
  // const coordinates = addressToCoords(locations)

  const coords = await addressToCoords(locations)

  if (!coords) { return null }

  const { start, end } = coords
  const query = {
    query: `
    query {
      plan(
        from: {lat: ${start.lat}, lon: ${start.lon}}
        to: {lat: ${end.lat}, lon: ${end.lon}}
        numItineraries: 1
      ) {
        itineraries {
          legs {
            mode
            from {
              name
              stop {
                code
                name
              }
            },
            to {
              name
            },
          }
        }
      }
    }
  `,
  }
  try {
    const res = await request(routeBaseUrl, { method: 'post', data: query })
    const itins = res.data.data.plan.itineraries
    const waypoints = []

    itins.forEach(it => {
      it.legs.forEach(leg => {
        const waypoint = {
          mode: leg.mode,
          from: leg.from.name,
          to: leg.to.name,
        }
        waypoints.push(waypoint)
      })
    })

    return getRouteString(waypoints)
  } catch (err) {
    error(err)
    return 'vammaset tiedot'
  }
}

module.exports = {
  route,
  getRoute,
}
