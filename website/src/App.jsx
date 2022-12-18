import React from 'react'
import { Routes, Route } from 'react-router-dom'
import NavbarWrapper from './components/NavbarWrapper'
import pages from './pages'

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<NavbarWrapper />}>
					{pages.map((page, i) => {
						return <Route path={page.path} element={page.element} key={i} />
					})}
				</Route>
			</Routes>
		</>
	)
}

export default App
