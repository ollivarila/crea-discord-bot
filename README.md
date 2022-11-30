# Crea's discord bot

## Features:
___

```
/echo
```

Sends the received message back  
**Options**:
- message

___
      
```
/route
```

Get a planned itinerary from [Digitransit](https://digitransit.fi/en/developers/apis/4-realtime-api/) api (Helsinki, Espoo, Vantaa only).

**Options**:
- start
- end
___

```
/ping
```

Ping the bot

___

```
/weather
```

Get weather forecast from a city for the next 24 hours from [OpenWeather](https://openweathermap.org/api).

**Options**:
- query
- utc offset
___

```
/subscribe
```

Subscribe to daily weather updates

**Options**:
- cities
- time
- timezone

___

```
/unsubscribe
```

Unsubscrbe from daily weather updates

___

```
/challenge
```

Challenge a user to a game of chess

**Options**:
- user

___

```
/esportal
```

Esportal commands

**Subcommands**:

```
/leaderboard
```
- **Subcommands**:
  - create
    - creates a leaderboard for server
    - **Options**:
      - channel id
  - add
    - add player to leaderboard
    - **Options**:
      - player
  - remove
    - remove player from leaderboard
    - **Options**:
      - player
  - delete
    - deletes leaderboard from server
  - current
    - returns the current state of the leaderboard

```
/stats
```

**Options**:

- player

___

```
/remindme
```

Sends a reminder to you

**Options**:
- time
- message

TODO:
====
- better version control and deployment pipeline
- website with React to display information about the bot
- polish /route
- /quote command (add remove get)
- comment code
- improve challenge command
- use DEFERRED_UPDATE_MESSAGE to make bot seem smoother