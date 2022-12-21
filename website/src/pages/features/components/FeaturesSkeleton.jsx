import React from 'react'
import { Skeleton, Grid, Card, Box } from '@mui/material'

const FeatureSkeleton = () => {
	return (
		<Grid item xs={12} sm={4}>
			<Box>
				<Skeleton variant="rounded" height={40} />
				<Skeleton variant="rounded" height={10} sx={{ marginTop: '12px' }} />
				<Skeleton
					variant="rounded"
					height={10}
					sx={{ marginTop: '10px', width: '50%' }}
				/>
			</Box>
		</Grid>
	)
}

const FeaturesSkeleton = ({ amount }) => {
	const skeletons = []

	for (let i = 0; i < amount; i++) {
		skeletons.push(<FeatureSkeleton key={i} />)
	}

	return (
		<Grid container spacing="12px">
			{skeletons}
		</Grid>
	)
}

export default FeaturesSkeleton
