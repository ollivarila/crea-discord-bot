import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App'
import { Provider } from 'react-redux'
import store from '../store'
import { ThemeProvider } from '@mui/material'
import { CssBaseline } from '@mui/material'
import theme from './theme'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<Provider store={store}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<Router>
					<App />
				</Router>
			</ThemeProvider>
		</Provider>
	</React.StrictMode>,
)
