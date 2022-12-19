import React, { useEffect, useState } from 'react'
import { Grow, Grid, useMediaQuery } from '@mui/material'
import axios from 'axios'
import FeatureCard from './components/FeatureCard'

const Features = () => {
	const matches = useMediaQuery('(min-width:600px)')
	const [features, setFeatures] = useState(null)

	useEffect(() => {
		const url = 'http://localhost:3001/api/features'
		axios
			.get(url)
			.then(res => setFeatures(res.data))
			.catch(err => setFeatures(null))

		return () => setFeatures(null)
	}, [])
	console.log(features)
	return (
		<>
			<Grow in>
				<Grid container spacing="12px">
					{features &&
						features.map(feature => (
							<FeatureCard key={feature.name} {...feature} />
						))}
				</Grid>
			</Grow>
		</>
	)
}

export default Features
