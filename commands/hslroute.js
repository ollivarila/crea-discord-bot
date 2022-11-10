import axios from "axios";
import { capitalize } from "../utils.js";

const route = {
  type: 1,
  name: 'route',
  description: 'find hsl route',
  options: [
    {
      type: 3,
      name: 'start',
      description: 'starting address',
    },
    {
      type: 3,
      name: 'end',
      description: 'ending address',
    }
  ]
}

const routeBaseUrl = 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql'
const addressToCoordsBaseUrl = 'https://api.digitransit.fi/geocoding/v1/search'

const addressToCoords = async (locations) => {
  const { start, end } = locations
  const url = `${addressToCoordsBaseUrl}?text=`
  let res = await axios.get(url + start)
  const coordsStart = res.data.features[0].geometry.coordinates

  res = await axios.get(url + end)
  const coordsEnd = res.data.features[0].geometry.coordinates

  return {
    start: coordsStart,
    end: coordsEnd
  }
}

export const getRoute = async (locations) => {
  //const coordinates = addressToCoords(locations)

  const coords = await addressToCoords(locations)
  const { start, end } = coords
  const query = {
    query: `
    query {
      plan(
        from: {lat: ${start[1]}, lon: ${start[0]}}
        to: {lat: ${end[1]}, lon: ${end[0]}}
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
  `
  }

  const res = await axios.post(routeBaseUrl, query)

  if(res.status !== 200){
    console.log(res.error)
    console.error('Error with getroute')
  }
  console.log(res.data)
  const itins = res.data.data.plan.itineraries

  const waypoints = []

  itins.forEach(it => {
    //console.log('Route object',it)
    it.legs.forEach(leg => {
      const waypoint = {
        mode: leg.mode,
        from: leg.from.name,
        to: leg.to.name
      }
      //console.log('from ', leg.from, 'to', leg.to)
      waypoints.push(waypoint)
    })
  })
  console.log(waypoints)

  if(waypoints.length === 0) {
    return 'vitun vammaset tiedot'
  }
  

  return getRouteString(waypoints)
}

const getRouteString = (route) => {
  let str = ''
  route.forEach((waypoint, i) => {
    const temp = `${i + 1}. ${capitalize(waypoint.mode)}, from ${waypoint.from} to ${waypoint.to} \n`
    str += temp
  })
  return str
} 

export default route