import { useInfiniteQuery } from 'react-query'

import API from '../services/axios'
import { FirebasePost } from '../utils/types/firebase'
import { jsonTimeObj } from '../utils/types/global'

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
    _feed: string
}

// API fetch wrapper
export const getPosts = async (): Promise<getPostsPayload> => {
    // Create params
    const params: getPostsParams = {
        _index: 'timestamp',
        _order: 'desc',
        _after: Math.floor(Date.now() / 1000),
        _size: 10,
        _feed: 'All',
    }

    // Call api
    const response = await API.get('posts', { params: params }).catch(error => {
        console.log(error.toJSON())
        return { data: 'There was an error' }
    })

    return response.data
}

export const getFeeds = async (
    pageParam = Math.floor(Date.now() / 1000),
    feed: string
): Promise<getPostsPayload> => {
    // Create params
    const params: getPostsParams = {
        _index: 'timestamp',
        _order: 'desc',
        _after: pageParam,
        _size: 10,
        _feed: feed,
    }

    // Call api
    const response = await API.get('posts', { params: params }).catch(error => {
        console.log(error.toJSON())
        return { data: 'There was an error' }
    })

    return response.data
}

// Custom Query hooks
export const useInfinitePostsQuery = (feed: string) =>
    useInfiniteQuery(
        ['posts', 'infinite', feed],
        ({ pageParam }) => getFeeds(pageParam, feed),
        {
            // initialData: () => {
            //     const allPosts
            // }

            // refetchInterval: 2 * 1000,
            // getPreviousPageParam: firstPage => firstPage.firstTimestamp.seconds ?? undefined,
            getNextPageParam: lastPage =>
                (lastPage.hasNextPage && lastPage.lastTimestamp.seconds) ||
                undefined,
        }
    )
