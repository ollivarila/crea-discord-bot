import React from 'react'
import { Info, Terminal } from '@mui/icons-material'
import Information from './Information'
import Commands from './Commands'

const items = [
	{
		name: 'Info',
		icon: <Info />,
		element: <Information />,
	},
	{
		name: 'Command usage',
		icon: <Terminal />,
		element: <Commands />,
	},
]

export default items
