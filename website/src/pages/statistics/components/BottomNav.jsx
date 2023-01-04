import React, { useState } from 'react'
import items from './items'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import { Paper } from '@mui/material'

const BottomNav = ({ selected, setSelected }) => {
	const [value, setValue] = useState('Info')

	const handleChange = (event, newValue) => {
		setValue(newValue)
	}

	const handleClick = number => {
		setSelected(number)
	}

	return (
		<Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}>
			<BottomNavigation showLabels value={value} onChange={handleChange}>
				{items.map((item, i) => (
					<BottomNavigationAction
						key={item.name}
						label={item.name}
						value={item.name}
						icon={item.icon}
						onClick={() => handleClick(i)}
					/>
				))}
			</BottomNavigation>
		</Paper>
	)
}

export default BottomNav
