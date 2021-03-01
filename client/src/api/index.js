import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
})

export const listCountries = () => api.get('/listCountries')
export const listCities = country => api.post('/listCities', country)
export const queryCity = city => api.post('/city', city)


const apis = {
    listCities,
    queryCity,
    listCountries
}

export default apis
