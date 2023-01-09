import React, { useState } from 'react'
import { Button, Card, Typography, Grid } from '@mui/material'
import FeatureDetails from './FeatureDetails'

const FeatureCard = ({ name, description, details }) => {
	const [open, setOpen] = useState(false)

	const toggleDetails = () => {
		setOpen(!open)
	}

	return (
		<Grid item xs={12} sm={4}>
			<Card
				sx={{
					padding: '24px',
				}}>
				<Typography variant="h4" gutterBottom>
					{name.toUpperCase()}
				</Typography>
				<Typography gutterBottom>{description}</Typography>
				<Button onClick={toggleDetails}>details</Button>
				<FeatureDetails
					name={name.toUpperCase()}
					description={description}
					open={open}
					handleClose={toggleDetails}
					details={details}
				/>
			</Card>
		</Grid>
	)
}

export default FeatureCard
