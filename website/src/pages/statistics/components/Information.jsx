import React from 'react'
import { useSelector } from 'react-redux'
import { Box, Card, Typography } from '@mui/material'

const calculateUptime = timeOfStartUp => {
	const now = new Date(Date.now())
	const old = new Date(timeOfStartUp)
	const deltaTime = now.getTime() - old.getTime()
	const timeInHours = deltaTime / 1000 / 60 / 60
	return timeInHours.toFixed(0)
}

const calculateMostPopularCommand = commands => {
	const copy = [...commands]
	return copy.sort((a, b) => a.timesUsed - b.timesUsed).pop()
}

const Information = () => {
	const stats = useSelector(state => state.statistics)

	if (!stats) {
		return null
	}

	const { commands, uptime, commandsUsed } = stats
	const uptimeInHours = calculateUptime(uptime)
	const mostPopular = calculateMostPopularCommand(commands)

	return (
		<Box>
			<Typography variant="h2">Info</Typography>
			<Card sx={{ padding: '12px' }}>
				<Typography>Commands used: {commandsUsed}</Typography>
				<Typography>Uptime: {uptimeInHours}h</Typography>
				<Typography>
					Most popular command group: {mostPopular.name} used{' '}
					{mostPopular.timesUsed} times
				</Typography>
			</Card>
		</Box>
	)
}

export default Information
