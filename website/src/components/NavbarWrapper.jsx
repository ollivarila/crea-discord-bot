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
					display: 'flex',
					height: '100%',
					justifyContent: 'center',
					marginTop: '24px',
				}}
			>
				<Outlet />
			</Container>
		</>
	)
}

export default NavbarWrapper
