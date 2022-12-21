import React from 'react'
import { Typography, Modal, Box } from '@mui/material'

const FeatureDetails = ({ name, description, details, open, handleClose }) => {
	const style = {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: 400,
		bgcolor: 'background.paper',
		boxShadow: 24,
		borderRadius: '5px',
		pt: 2,
		px: 4,
		pb: 3,
	}

	return (
		<Modal open={open} onClose={handleClose}>
			<Box sx={{ ...style }}>
				<Typography gutterBottom variant="h4">
					{name}
				</Typography>
				<Typography gutterBottom>{description}</Typography>
				{details && <Typography>{details}</Typography>}
			</Box>
		</Modal>
	)
}

export default FeatureDetails
