/* eslint-disable no-undef */
const axios = require('axios')
const { default: MockAdapter } = require('axios-mock-adapter')

const lichessUrl = 'https://lichess.org/api/challenge/open'
const createDmUrl = 'https://discord.com/api/v10/users/@me/channels'
// const esportalUrl = ''

const weatherRes = {
  cod: '200',
  message: 0,
  cnt: 40,
  list: [
    {
      dt: 1668816000,
      main: {
        temp: -3.54,
        feels_like: -8.9,
        temp_min: -3.56,
        temp_max: -3.54,
        pressure: 1020,
        sea_level: 1020,
        grnd_level: 1019,
        humidity: 82,
        temp_kf: 0.02,
      },
      weather: [
        {
          id: 801,
          main: 'Clouds',
          description: 'few clouds',
          icon: '02n',
        },
      ],
      clouds: {
        all: 20,
      },
      wind: {
        speed: 4.35,
        deg: 54,
        gust: 11.31,
      },
      visibility: 10000,
      pop: 0,
      sys: {
        pod: 'n',
      },
      dt_txt: '2022-11-19 00:00:00',
    },
    {
      dt: 1668826800,
      main: {
        temp: -3.49,
        feels_like: -9.2,
        temp_min: -3.49,
        temp_max: -3.39,
        pressure: 1021,
        sea_level: 1021,
        grnd_level: 1019,
        humidity: 80,
        temp_kf: -0.1,
      },
      weather: [
        {
          id: 801,
          main: 'Clouds',
          description: 'few clouds',
          icon: '02n',
        },
      ],
      clouds: {
        all: 20,
      },
      wind: {
        speed: 4.87,
        deg: 50,
        gust: 12.17,
      },
      visibility: 10000,
      pop: 0,
      sys: {
        pod: 'n',
      },
      dt_txt: '2022-11-19 03:00:00',
    },
    {
      dt: 1668837600,
      main: {
        temp: -3.34,
        feels_like: -9.03,
        temp_min: -3.34,
        temp_max: -3.24,
        pressure: 1021,
        sea_level: 1021,
        grnd_level: 1019,
        humidity: 78,
        temp_kf: -0.1,
      },
      weather: [
        {
          id: 801,
          main: 'Clouds',
          description: 'few clouds',
          icon: '02n',
        },
      ],
      clouds: {
        all: 21,
      },
      wind: {
        speed: 4.9,
        deg: 54,
        gust: 12.5,
      },
      visibility: 10000,
      pop: 0,
      sys: {
        pod: 'n',
      },
      dt_txt: '2022-11-19 06:00:00',
    },
    {
      dt: 1668848400,
      main: {
        temp: -1.86,
        feels_like: -7.45,
        temp_min: -1.86,
        temp_max: -1.86,
        pressure: 1022,
        sea_level: 1022,
        grnd_level: 1019,
        humidity: 72,
        temp_kf: 0,
      },
      weather: [
        {
          id: 802,
          main: 'Clouds',
          description: 'scattered clouds',
          icon: '03d',
        },
      ],
      clouds: {
        all: 35,
      },
      wind: {
        speed: 5.34,
        deg: 57,
        gust: 12.4,
      },
      visibility: 10000,
      pop: 0.2,
      sys: {
        pod: 'd',
      },
      dt_txt: '2022-11-19 09:00:00',
    },
    {
      dt: 1668859200,
      main: {
        temp: -1.2,
        feels_like: -6.41,
        temp_min: -1.2,
        temp_max: -1.2,
        pressure: 1022,
        sea_level: 1022,
        grnd_level: 1019,
        humidity: 94,
        temp_kf: 0,
      },
      weather: [
        {
          id: 600,
          main: 'Snow',
          description: 'light snow',
          icon: '13d',
        },
      ],
      clouds: {
        all: 66,
      },
      wind: {
        speed: 4.98,
        deg: 83,
        gust: 10.99,
      },
      visibility: 187,
      pop: 0.57,
      snow: {
        '3h': 0.79,
      },
      sys: {
        pod: 'd',
      },
      dt_txt: '2022-11-19 12:00:00',
    },
    {
      dt: 1668870000,
      main: {
        temp: -1.38,
        feels_like: -5.67,
        temp_min: -1.38,
        temp_max: -1.38,
        pressure: 1023,
        sea_level: 1023,
        grnd_level: 1020,
        humidity: 93,
        temp_kf: 0,
      },
      weather: [
        {
          id: 600,
          main: 'Snow',
          description: 'light snow',
          icon: '13n',
        },
      ],
      clouds: {
        all: 100,
      },
      wind: {
        speed: 3.59,
        deg: 87,
        gust: 8.47,
      },
      visibility: 355,
      pop: 0.36,
      snow: {
        '3h': 1,
      },
      sys: {
        pod: 'n',
      },
      dt_txt: '2022-11-19 15:00:00',
    },
    {
      dt: 1668880800,
      main: {
        temp: -1.92,
        feels_like: -5.95,
        temp_min: -1.92,
        temp_max: -1.92,
        pressure: 1022,
        sea_level: 1022,
        grnd_level: 1019,
        humidity: 94,
        temp_kf: 0,
      },
      weather: [
        {
          id: 600,
          main: 'Snow',
          description: 'light snow',
          icon: '13n',
        },
      ],
      clouds: {
        all: 100,
      },
      wind: {
        speed: 3.16,
        deg: 55,
        gust: 7.56,
      },
      visibility: 222,
      pop: 0.32,
      snow: {
        '3h': 0.58,
      },
      sys: {
        pod: 'n',
      },
      dt_txt: '2022-11-19 18:00:00',
    },
    {
      dt: 1668891600,
      main: {
        temp: -2.57,
        feels_like: -7.42,
        temp_min: -2.57,
        temp_max: -2.57,
        pressure: 1022,
        sea_level: 1022,
        grnd_level: 1019,
        humidity: 85,
        temp_kf: 0,
      },
      weather: [
        {
          id: 600,
          main: 'Snow',
          description: 'light snow',
          icon: '13n',
        },
      ],
      clouds: {
        all: 100,
      },
      wind: {
        speed: 3.97,
        deg: 46,
        gust: 9.24,
      },
      visibility: 10000,
      pop: 0.28,
      snow: {
        '3h': 0.33,
      },
      sys: {
        pod: 'n',
      },
      dt_txt: '2022-11-19 21:00:00',
    },
    {
      dt: 1668902400,
      main: {
        temp: -2.94,
        feels_like: -8.15,
        temp_min: -2.94,
        temp_max: -2.94,
        pressure: 1020,
        sea_level: 1020,
        grnd_level: 1017,
        humidity: 91,
        temp_kf: 0,
      },
      weather: [
        {
          id: 600,
          main: 'Snow',
          description: 'light snow',
          icon: '13n',
        },
      ],
      clouds: {
        all: 100,
      },
      wind: {
        speed: 4.34,
        deg: 43,
        gust: 10.54,
      },
      visibility: 601,
      pop: 0.47,
      snow: {
        '3h': 0.19,
      },
      sys: {
        pod: 'n',
      },
      dt_txt: '2022-11-20 00:00:00',
    },
    {
      dt: 1668913200,
      main: {
        temp: -2.6,
        feels_like: -8.12,
        temp_min: -2.6,
        temp_max: -2.6,
        pressure: 1018,
        sea_level: 1018,
        grnd_level: 1015,
        humidity: 88,
        temp_kf: 0,
      },
      weather: [
        {
          id: 600,
          main: 'Snow',
          description: 'light snow',
          icon: '13n',
        },
      ],
      clouds: {
        all: 100,
      },
      wind: {
        speed: 4.92,
        deg: 49,
        gust: 12.23,
      },
      visibility: 2118,
      pop: 0.73,
      snow: {
        '3h': 0.44,
      },
      sys: {
        pod: 'n',
      },
      dt_txt: '2022-11-20 03:00:00',
    },
    {
      dt: 1668924000,
      main: {
        temp: -2.69,
        feels_like: -8.28,
        temp_min: -2.69,
        temp_max: -2.69,
        pressure: 1016,
        sea_level: 1016,
        grnd_level: 1013,
        humidity: 89,
        temp_kf: 0,
      },
      weather: [
        {
          id: 600,
          main: 'Snow',
          description: 'light snow',
          icon: '13n',
        },
      ],
      clouds: {
        all: 100,
      },
      wind: {
        speed: 5,
        deg: 57,
        gust: 12.47,
      },
      visibility: 922,
      pop: 0.69,
      snow: {
        '3h': 0.73,
      },
      sys: {
        pod: 'n',
      },
      dt_txt: '2022-11-20 06:00:00',
    },
    {
      dt: 1668934800,
      main: {
        temp: -1.72,
        feels_like: -6.74,
        temp_min: -1.72,
        temp_max: -1.72,
        pressure: 1015,
        sea_level: 1015,
        grnd_level: 1012,
        humidity: 95,
        temp_kf: 0,
      },
      weather: [
        {
          id: 601,
          main: 'Snow',
          description: 'snow',
          icon: '13d',
        },
      ],
      clouds: {
        all: 100,
      },
      wind: {
        speed: 4.49,
        deg: 69,
        gust: 10.7,
      },
      visibility: 131,
      pop: 0.6,
      snow: {
        '3h': 1.92,
      },
      sys: {
        pod: 'd',
      },
      dt_txt: '2022-11-20 09:00:00',
    },
    {
      dt: 1668945600,
      main: {
        temp: -0.86,
        feels_like: -4.64,
        temp_min: -0.86,
        temp_max: -0.86,
        pressure: 1013,
        sea_level: 1013,
        grnd_level: 1011,
        humidity: 97,
        temp_kf: 0,
      },
      weather: [
        {
          id: 601,
          main: 'Snow',
          description: 'snow',
          icon: '13d',
        },
      ],
      clouds: {
        all: 100,
      },
      wind: {
        speed: 3.12,
        deg: 111,
        gust: 7.34,
      },
      visibility: 116,
      pop: 0.71,
      snow: {
        '3h': 3.17,
      },
      sys: {
        pod: 'd',
      },
      dt_txt: '2022-11-20 12:00:00',
    },
    {
      dt: 1668956400,
      main: {
        temp: -1.91,
        feels_like: -6.15,
        temp_min: -1.91,
        temp_max: -1.91,
        pressure: 1013,
        sea_level: 1013,
        grnd_level: 1010,
        humidity: 96,
        temp_kf: 0,
      },
      weather: [
        {
          id: 601,
          main: 'Snow',
          description: 'snow',
          icon: '13n',
        },
      ],
      clouds: {
        all: 100,
      },
      wind: {
        speed: 3.4,
        deg: 129,
        gust: 7.6,
      },
      visibility: 162,
      pop: 1,
      snow: {
        '3h': 2.4,
      },
      sys: {
        pod: 'n',
      },
      dt_txt: '2022-11-20 15:00:00',
    },
  ],
  city: {
    id: 660129,
    name: 'Espoo',
    coord: {
      lat: 60.25,
      lon: 24.6667,
    },
    country: 'FI',
    population: 0,
    timezone: 7200,
    sunrise: 1668839422,
    sunset: 1668865397,
  },
}

const mockItinerary = {
  plan: {
    itineraries: [
      {
        legs: [
          {
            mode: 'WALK',
            from: {
              name: 'Origin',
              stop: null,
            },
            to: {
              name: 'Kamppi',
            },
          },
          {
            mode: 'BUS',
            from: {
              name: 'Kamppi',
              stop: {
                code: 'H1249',
                name: 'Kamppi',
              },
            },
            to: {
              name: 'Puolarmäki',
            },
          },
          {
            mode: 'WALK',
            from: {
              name: 'Puolarmäki',
              stop: {
                code: 'E4325',
                name: 'Puolarmäki',
              },
            },
            to: {
              name: 'Destination',
            },
          },
        ],
      },
    ],
  },
}

const mockPlayerData = {
  username: 'mockPlayer',
  avatar_hash: '327137462fbcb3d1272285bc2027c268eb0d7c8b',
  wins: 636,
  losses: 592,
  elo: 1709,
  kills: 23726,
  deaths: 22216,
  matches: 1301,
  mvps: 123,
  headshots: 9258,
}

const mock = new MockAdapter(axios)
mock.onGet('https://api.digitransit.fi/geocoding/v1/search?text=mockValue').reply(200, { features: [{ geometry: { coordinates: [123, 321] } }] })
mock.onPost('https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql', expect.objectContaining({
  query: expect.anything(),
})).reply(200, { data: mockItinerary })

mock.onGet(`https://api.openweathermap.org/data/2.5/forecast?units=metric&lang=en&q=mockValue&appid=${process.env.WEATHERTOKEN}`)
  .reply(200, weatherRes)

mock.onPost(lichessUrl, expect.objectContaining({
  clock: {
    limit: 300,
    increment: 5,
  },
})).reply(200, { challenge: { url: 'test' } })

// Discord
mock.onPost(createDmUrl, expect.objectContaining({
  recipient_id: expect.anything(),
})).reply(200, { id: 'mockChannelId' })

const sendDmUrl = 'https://discord.com/api/v10/channels/mockChannelId/messages'

mock.onPost(sendDmUrl, expect.anything(), expect.objectContaining({
  Authorization: expect.not.stringContaining('undefined'),
})).reply(200, { id: 'mockMessageId' })

mock.onPost(`${sendDmUrl}/mockMessageId`, expect.anything(), expect.objectContaining({
  Authorization: expect.not.stringContaining('undefined'),
})).reply(200, { id: 'mockMessageId' })

mock.onPatch(`${sendDmUrl}/mockMessageId`, expect.anything(), expect.objectContaining({
  Authorization: expect.not.stringContaining('undefined'),
})).reply(200, { id: 'mockMessageId' })

mock.onDelete(`${sendDmUrl}/mockMessageId`, expect.anything(), expect.objectContaining({
  Authorization: expect.not.stringContaining('undefined'),
})).reply(200, { id: 'mockMessageId' })

// Esportal
const requestUrl = 'https://esportal.com/api/user_profile/get?username=mockPlayer'

mock.onGet(requestUrl).reply(200, mockPlayerData)

module.exports = mock
