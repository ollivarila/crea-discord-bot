import React from 'react'
import { Typography, Card, Box, Grow } from '@mui/material'
import HomeAccordion from './components/HomeAccordion'

const Home = () => {
	return (
		<>
			<Grow in>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						height: '100%',
						width: '100%',
						alignItems: 'center',
						gap: '24px',
					}}>
					<Card
						sx={{ width: '100%', padding: '24px', boxSizing: 'border-box' }}>
						<Typography variant="h2" gutterBottom>
							Hello there
						</Typography>
						<Typography>
							Welcome to my discord bot website. This website contains
							information about my discord bot.
						</Typography>
					</Card>

					<HomeAccordion />
				</Box>
			</Grow>
		</>
	)
}

export default Home
