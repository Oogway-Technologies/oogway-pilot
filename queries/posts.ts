import API from '../axios';
import { FirebasePost } from '../utils/types/firebase';
import { useQuery, useInfiniteQuery } from 'react-query'

type getPostsPayload = {
    posts: ReadonlyArray<FirebasePost>
    lastTimestamp: Date
    firstTimestamp: Date
}

interface getPostsProps {
    index: 'timestamp' | 'uid',
    order: 'asc' | 'desc',
    after: number,
    size: number,
}


// API fetch wrapper
export const getPosts = async ({
    after,
    size = 10,     
    index = 'timestamp', 
    order = 'desc'   
    }: getPostsProps
): Promise<getPostsPayload> => {
    console.log(after)
    // Create params
    const params = {
        _index: index,
        _order: order,
        _after: after,
        _size: size
    }
    
    // Call api
    const { data } = await API.get('posts', { params: params })
    return data
}

// Custom Query hooks
export const usePostsQuery = () => useQuery('posts-all', getPosts)

export  const useInfinitePostsQuery = () => useInfiniteQuery(
    'posts-infinite',
    ({pageParam = 0 }) => getPosts(pageParam),
    {
        getPreviousPageParam: firstPage => firstPage.firstTimestamp.seconds ?? false,
        getNextPageParam: lastPage => lastPage.lastTimestamp.seconds ?? false,
    }
)
