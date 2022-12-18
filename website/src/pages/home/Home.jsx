import React from 'react'
import { Typography, Card, Box } from '@mui/material'
import HomeAccordion from './components/HomeAccordion'

const Home = () => {
	return (
		<>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					height: '100%',
					width: '100%',
					alignItems: 'center',
					gap: '48px',
				}}>
				<Card sx={{ width: '100%', padding: '24px', boxSizing: 'border-box' }}>
					<Typography variant="h2" gutterBottom>
						Hello there
					</Typography>
					<Typography>Here I will have some smaller text</Typography>
				</Card>

				<HomeAccordion />
			</Box>
		</>
	)
}

export default Home
