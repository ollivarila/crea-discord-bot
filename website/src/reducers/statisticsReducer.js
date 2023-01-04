import { createSlice } from '@reduxjs/toolkit'
import getStatistics from '../utils/statisticsHelper'

const initialState = null

const statisticsSlice = createSlice({
	name: 'statistics',
	initialState,
	reducers: {
		setStatistics(state, action) {
			return action.payload
		},
	},
})

export const { setStatistics } = statisticsSlice.actions

export const initializeStatistics = () => {
	return async dispatch => {
		const stats = await getStatistics()
		dispatch(setStatistics(stats))
	}
}

export default statisticsSlice.reducer
