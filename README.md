Crea's discord bot
======

## Features:


Sends the received message back  
**Options**:
- message

      /echo
      
Get a planned itinerary from [Digitransit](https://digitransit.fi/en/developers/apis/4-realtime-api/) api (Helsinki, Espoo, Vantaa only).

**Options**:
- start
- end


      /route

Ping the bot

      /ping

Get weather forecast from a city for the next 24 hours from [OpenWeather](https://openweathermap.org/api).

**Options**:
- query1
- query2
- query3

      /weather

Subscribe to daily weather updates

**Options**
- cities
- time
- timezone

      /subscribe

TODO:
====
- update subscription
- user can only have one? subscription at a time
- caching
- website with React to display information about the bot
- remindme command
- esportal leaderboard (/add, /leaderboard, /create, /remove)
- /stats command for esportal statistics
- proper axios mock
