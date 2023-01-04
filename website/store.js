import { configureStore } from '@reduxjs/toolkit'
import statisticsReducer from './src/reducers/statisticsReducer'

const store = configureStore({
	reducer: {
		statistics: statisticsReducer,
	},
})

export default store
