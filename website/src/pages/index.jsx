import React from 'react'
import Features from './features/Features'
import Home from './home/Home'

const pages = [
	{
		name: 'Home',
		path: '/',
		element: <Home />,
	},
	{
		name: 'Features',
		path: '/features',
		element: <Features />,
	},
]

export default pages
