import React, { useState } from 'react'
import {
	IconButton,
	AppBar,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	List,
	ListItem,
	ListItemButton,
	Divider,
	Typography,
} from '@mui/material'
import { Menu, MenuOpen } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import pages from '../pages'

const NavListItem = ({ name, path }) => (
	<ListItem
		sx={{
			'.MuiButtonBase-root': {
				justifyContent: 'center',
			},
		}}>
		<ListItemButton>
			<Typography variant="h4">
				<Link to={path}>{name}</Link>
			</Typography>
		</ListItemButton>
	</ListItem>
)

const TogglableNav = () => {
	const [open, setOpen] = useState(false)

	const handleDrawerToggle = () => {
		console.log(open)
		setOpen(!open)
	}

	return (
		<AppBar
			sx={{
				position: 'relative',
				minHeight: '100px',
			}}>
			<Accordion
				sx={{
					backgroundColor: 'inherit',
					boxShadow: 'none',
				}}
				square>
				<AccordionSummary
					sx={{
						'.MuiAccordionSummary-content': {
							justifyContent: 'center',
							margin: '10px',
						},
					}}>
					<IconButton
						onClick={handleDrawerToggle}
						sx={{
							width: 'fit-content',
							padding: '24px',
						}}>
						{open ? <MenuOpen /> : <Menu />}
					</IconButton>
				</AccordionSummary>
				<AccordionDetails sx={{ paddingBottom: '0', paddingTop: '0' }}>
					<List sx={{ paddingBottom: '0', paddingTop: '0' }}>
						<Divider />
						{pages.map((page, i) => (
							<NavListItem {...page} key={i} />
						))}
					</List>
				</AccordionDetails>
			</Accordion>
		</AppBar>
	)
}

export default TogglableNav
