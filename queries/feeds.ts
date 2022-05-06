import { useQuery } from 'react-query'

import API from '../lib/axios/axios'
import { FirebaseFeed } from '../utils/types/firebase'

type getFeedsPayload = {
    feeds: ReadonlyArray<FirebaseFeed>
}

// API Fetch wrapper
export const getFeeds = async (): Promise<getFeedsPayload> => {
    const response = await API.get('feeds').catch(error => {
        console.log(error.toJSON())
        return { data: 'There was an error' }
    })
    return response.data
}

// Custom Query hooks
export const useFeedsQuery = () => useQuery('feeds', getFeeds)
