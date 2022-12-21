const features = [
	{
		name: 'misc',
		description: 'Miscellanious commands.',
		details: 'Available subcommands are ping, echo and pp.',
	},
	{
		name: 'route',
		description: 'Find planned hsl itinerary in Espoo, Helsinki or Vantaa.',
		details: 'Takes two parameters start address and end address.',
	},
	{
		name: 'challenge',
		description: 'Challenge user to a chess match.',
		details:
			'Creates a match using the lichess api. Takes the player you want to challenge as parameter.',
	},
	{
		name: 'esportal',
		description: 'Various esportal related commands.',
		details:
			'Contains two subcommand groups. One for getting stats of one user and one for creating a leaderboard on a discord server. Leaderboard contains commands to add and remove players from it and more.',
	},
	{
		name: 'remindme',
		description: 'Reminds you after a specified time',
		details:
			'Takes two parameters. The time when you want to be notified i.e 1 hour and 20 minutes and the message that the bot will send you as a notification.',
	},
	{
		name: 'weather',
		description: 'Weather forecast commands',
		details:
			'You can either get current weather from any city in the world or you can get 24h forecast. 24h forecast supports multiple queries separated by a comma i.e Espoo, Helsinki. ',
	},
	{
		name: 'subscribe',
		description: 'Subscribe to daily weather forecast',
		details:
			'Sends you a 24h forecasts to dm at a specified time. Takes 3 parameters. Cities, time i.e 8:00, and utc offset i.e +2',
	},
	{
		name: 'unsubscribe',
		description: 'Unsubscribe from daily weather forecast',
	},
]

module.exports = features
