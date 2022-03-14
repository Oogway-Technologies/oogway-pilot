import { useInfiniteQuery, useQuery } from 'react-query'

import API from '../axios'
import { FirebasePost } from '../utils/types/firebase'

type jsonTimeObj = {
    seconds: number
    nanoseconds: number
}

type getPostsPayload = {
    posts: ReadonlyArray<FirebasePost>
    lastTimestamp: jsonTimeObj
    firstTimestamp: jsonTimeObj
    hasNextPage: boolean
}

type getPostsParams = {
    _index: 'timestamp' | 'uid'
    _order: 'asc' | 'desc'
    _after: number
    _size: number
}

// API fetch wrapper
export const getPosts = async ({
    pageParam = Math.floor(Date.now() / 1000),
}): Promise<getPostsPayload> => {
    // Create params
    const params: getPostsParams = {
        _index: 'timestamp',
        _order: 'desc',
        _after: pageParam,
        _size: 10,
    }

    // Call api
    const response = await API.get('posts', { params: params }).catch(error => {
        console.log(error.toJSON())
        return { data: 'There was an error' }
    })

    return response.data
}

// Custom Query hooks
export const usePostsQuery = () => useQuery('posts-all', getPosts)

export const useInfinitePostsQuery = () =>
    useInfiniteQuery(['posts', 'infinite'], getPosts, {
        // refetchInterval: 2 * 1000,
        // getPreviousPageParam: firstPage => firstPage.firstTimestamp.seconds ?? undefined,
        getNextPageParam: lastPage =>
            (lastPage.hasNextPage && lastPage.lastTimestamp.seconds) ||
            undefined,
    })
