import React from 'react'
import { Card, Typography, Grid } from '@mui/material'

const FeatureCard = ({ name, description, options }) => {
	return (
		<Grid item xs={12} sm={4}>
			<Card
				sx={{
					padding: '24px',
				}}>
				<Typography variant="h4" gutterBottom>
					{name}
				</Typography>
				<Typography>{description}</Typography>
			</Card>
		</Grid>
	)
}

export default FeatureCard
