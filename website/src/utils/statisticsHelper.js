import axios from 'axios'
import config from '../../config'

const getStatistics = async () => {
	const url = `${config.BACKEND_URL}/api/statistics`
	return axios
		.get(url)
		.then(res => res.data)
		.catch(err => {
			console.error('Error getting statistics')
			return null
		})
}

export default getStatistics
