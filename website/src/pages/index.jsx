import React from 'react'
import Features from './features/Features'
import Home from './home/Home'
import Statistics from './statistics/Statistics'

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
	{
		name: 'Statistics',
		path: '/statistics',
		element: <Statistics />,
	},
]

export default pages
