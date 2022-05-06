import axios from 'axios'

import { bingVars, oogwayVars } from '../../utils/constants/global'

/**
 * Helper API handlers
 */
export const OogwayDecisionAPI = axios.create({
    baseURL: oogwayVars.oogway_decision_url,
})
export const BingSearchAPI = axios.create({
    baseURL: bingVars.retriever_bing_search_url,
})
BingSearchAPI.defaults.headers.get[bingVars.retriever_bing_header_key_tag] =
    bingVars.retriever_bing_header_key_value
