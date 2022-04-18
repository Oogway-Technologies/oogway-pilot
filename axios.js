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

// Create aaxios instance for oogway decision api
export const OogwayDecisionAPI = axios.create({
    baseURL: process.env.OOGWAY_DECISION_URL,
})

// Axious instance for Bing Api
export const BingSearchAPI = axios.create({
    baseURL: process.env.RETRIEVER_BING_SEARCH_URL,
})
BingSearchAPI.defaults.headers.get[process.env.RETRIEVER_BING_HEADER_KEY_TAG] =
    process.env.RETRIEVER_BING_HEADER_KEY_VALUE

export default API
