import React from 'react'
import { Box, Typography, Card } from '@mui/material'
import { useSelector } from 'react-redux'

const CommandCard = ({ name, timesUsed }) => (
	<Card>
		<div style={{ padding: '12px' }}>
			<Typography variant="h4">{name}</Typography>
			<Typography>Times used: {timesUsed}</Typography>
		</div>
	</Card>
)

const Commands = () => {
	const stats = useSelector(state => state.statistics)
	const { commands } = stats
	return (
		<Box>
			<Typography variant="h2">Command usage</Typography>
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
				{commands.map(command => (
					<CommandCard {...command} key={command.name} />
				))}
			</Box>
		</Box>
	)
}

export default Commands
