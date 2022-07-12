import axios from 'axios'
import createAuthRefreshInterceptor from 'axios-auth-refresh'

import { bingVars, oogwayVars } from '../../utils/constants/global'

/**
 * Helper API handlers
 */

// Oogway microservices
export const OogwayDecisionAPI = axios.create({
    baseURL: oogwayVars.oogway_decision_url,
})

export const OogwayBeanstalkAPI = axios.create({
    baseURL: oogwayVars.beanstalk_url,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
})

createAuthRefreshInterceptor(OogwayBeanstalkAPI, async failedRequest => {
    // 1. First try request fails - refresh the token.
    const resp = await OogwayBeanstalkAPI.post('api/v1/auth/login', {
        email: oogwayVars.beanstalk_user,
        password: oogwayVars.beanstalk_password,
    })
    const { token } = resp.data

    // 2. Set up new access token
    const bearer = `Bearer ${token}`
    OogwayBeanstalkAPI.defaults.headers.common['Authorization'] = bearer

    // 3. Set up access token of the failed request
    failedRequest.response.config.headers.Authorization = bearer

    // 4. Retry the request with the new setup
    return Promise.resolve()
})

// Bing search
export const BingSearchAPI = axios.create({
    baseURL: bingVars.retriever_bing_search_url,
})
BingSearchAPI.defaults.headers.get[bingVars.retriever_bing_header_key_tag] =
    bingVars.retriever_bing_header_key_value
