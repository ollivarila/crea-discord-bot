import React from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import Typography from '@mui/material/Typography'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import items from './items'

const drawerWidth = 240

const Item = ({ name, icon, handleClick }) => (
	<ListItem>
		<ListItemButton sx={{ gap: '5px' }} onClick={handleClick}>
			{icon}
			<Typography>{name}</Typography>
		</ListItemButton>
	</ListItem>
)

const Sidebar = ({ selected, setSelected }) => {
	const onClick = number => {
		setSelected(number)
	}

	return (
		<Drawer
			variant="permanent"
			sx={{
				width: drawerWidth,
				flexShrink: 0,
				[`& .MuiDrawer-paper`]: {
					position: 'absolute',
					top: 'var(--header-height)',
					width: drawerWidth,
					boxSizing: 'border-box',
					border: 1,
					borderTop: 0,
					borderLeft: 0,
				},
			}}>
			<Box sx={{ overflow: 'auto' }}>
				<List>
					{items.map((item, i) => (
						<Item
							key={item.name}
							name={item.name}
							icon={item.icon}
							handleClick={() => onClick(i)}
						/>
					))}
				</List>
			</Box>
		</Drawer>
	)
}

export default Sidebar
