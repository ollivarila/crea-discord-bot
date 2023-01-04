import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import { Box, useMediaQuery } from '@mui/material'
import BottomNav from './components/BottomNav'
import items from './components/items'
import { initializeStatistics } from '../../reducers/statisticsReducer'
import { useDispatch, useSelector } from 'react-redux'

const Statistics = () => {
	const matches = useMediaQuery('(min-width:600px)')
	const [selected, setSelected] = useState(0)
	const stats = useSelector(state => state.statistics)
	const dispatch = useDispatch()
	useEffect(() => {
		dispatch(initializeStatistics())
	}, [dispatch])

	return (
		<Box sx={{ display: 'flex' }}>
			{matches ? (
				<Sidebar selected={selected} setSelected={setSelected} />
			) : (
				<BottomNav selected={selected} setSelected={setSelected} />
			)}
			{items[selected].element}
		</Box>
	)
}

export default Statistics
