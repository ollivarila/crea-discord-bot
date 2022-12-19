import React from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'
import { Container } from '@mui/material'

const NavbarWrapper = () => {
	return (
		<>
			<Navbar />
			<Container
				sx={{
					height: '100%',
					marginTop: '48px',
				}}>
				<Outlet />
			</Container>
		</>
	)
}

export default NavbarWrapper
