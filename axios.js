/**
 * Setup default options for axios client
 *
 * For important information on defaults see:
 * https://axios-http.com/docs/config_defaults
 *
 * For more information on instances see:
 * https://axios-http.com/docs/instance
 */

import axios from 'axios'

// Set axios config defaults for API instance
const axiosConfig = {
    baseURL: '/api/',
}

// Create axios instance for API
const API = axios.create(axiosConfig)

export default API
