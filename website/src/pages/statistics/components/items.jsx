import React from 'react'
import { Info, Terminal } from '@mui/icons-material'
import Information from './Information'

const items = [
	{
		name: 'Info',
		icon: <Info />,
		element: <Information />,
	},
	{
		name: 'Command usage',
		icon: <Terminal />,
		element: <h1>not implemented</h1>,
	},
]

export default items
