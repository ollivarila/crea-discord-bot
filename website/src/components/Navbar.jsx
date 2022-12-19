import React from 'react'
import {
	AppBar,
	Box,
	Toolbar,
	Typography,
	MenuItem,
	useMediaQuery,
} from '@mui/material'
import pages from '../pages'
import TogglableNav from './TogglableNav'
import { Link } from 'react-router-dom'

const NavButton = ({ name, path }) => {
	return (
		<MenuItem>
			<Typography textAlign="center" variant="h4">
				<Link style={{ textAlign: 'center' }} to={path}>
					{name}
				</Link>
			</Typography>
		</MenuItem>
	)
}

const NavbarNormal = () => {
	return (
		<AppBar
			sx={{
				height: 'var(--header-height)',
				justifyContent: 'center',
				position: 'relative',
			}}>
			<Toolbar>
				{pages.map((page, i) => {
					return <NavButton {...page} key={i} />
				})}
			</Toolbar>
		</AppBar>
	)
}

const Navbar = () => {
	const matches = useMediaQuery('(min-width:600px)')

	if (matches) {
		return <NavbarNormal />
	}

	return <TogglableNav />
}

export default Navbar
