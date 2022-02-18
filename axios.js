import axios from 'axios'

// Set axxios config defaults for API instance
const axiosConfig = {
    baseURL: '/api/',
}

// Create axios instance for API
const API = axios.create(axiosConfig)

export default API
