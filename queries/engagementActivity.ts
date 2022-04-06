import { useInfiniteQuery, useMutation, useQueryClient } from 'react-query'

import API from '../services/axios'
import {
    FirebaseEngagement,
    FirebaseEngagementFragment,
} from '../utils/types/firebase'
import { jsonTimeObj } from '../utils/types/global'

/**
 * Creation hooks
 */

export const createEngagementActivity = async (
    newEngagementActivity: FirebaseEngagement
) => API.post('engagementActivity', newEngagementActivity)

export const useCreateEngagemmentActivity = (engageeId: string) => {
    const queryClient = useQueryClient()

    return useMutation(
        (newEngagementActivity: FirebaseEngagement) =>
            createEngagementActivity(newEngagementActivity),
        {
            retry: 3, // Attempt to send request 3 times if fail
            onSuccess: () => {
                // Invalidate the engagee's notifications so they refresh.
                queryClient.invalidateQueries(['engagementActivity', engageeId])
            },
        }
    )
}

/**
 * Retrieval Hooks
 */

type getEngagementsActivityPayload = {
    engagements: ReadonlyArray<FirebaseEngagement>
    lastTimestamp: jsonTimeObj
    firstTimestamp: jsonTimeObj
    hasNextPage: boolean
}

type getEngagementsActivityParams = {
    _index: 'timestamp'
    _order: 'asc' | 'desc'
    _after: number
    _size: number
    _isNew?: boolean
    _engageeId?: string
}

export const getEngagementActivity = async (
    pageParam = Math.floor(Date.now() / 1000),
    order: 'desc' | 'asc',
    size: number,
    engageeId?: string,
    isNew?: boolean
): Promise<getEngagementsActivityPayload> => {
    // Create params
    const params: getEngagementsActivityParams = {
        _index: 'timestamp',
        _order: order,
        _after: pageParam,
        _size: size,
        _isNew: isNew,
        _engageeId: engageeId,
    }

    // Call api
    const response = await API.get('engagementActivity', {
        params: params,
    }).catch(error => {
        console.log(error.toJSON())
        return { data: 'There was an error' }
    })

    return response.data
}

export const useInfiniteEngagementsQuery = (
    engageeId?: string,
    isNew?: boolean
) =>
    useInfiniteQuery(
        ['engagementActivity', engageeId, isNew],
        ({ pageParam }) =>
            getEngagementActivity(pageParam, 'desc', 5, engageeId, isNew),
        {
            // Infinite query pagination
            getNextPageParam: lastPage =>
                (lastPage.hasNextPage && lastPage.lastTimestamp.seconds) ||
                undefined,
            // Other params
            staleTime: 60 * 1000, // One minute
        }
    )

/**
 * Update hooks
 */

export const updateEngagementActivity = async (
    id: string,
    body: FirebaseEngagementFragment
): Promise<FirebaseEngagement> => {
    // Create params
    const params = { _id: id }

    // Call api
    const response = await API.patch('engagementActivity', body, {
        params: params,
    }).catch(error => {
        console.log(error.toJSON())
        return { data: 'There was an error' }
    })

    // Return updated resource
    return response.data
}

export const useUpdateEngagemmentActivity = (engageeId: string) => {
    const queryClient = useQueryClient()

    return useMutation(
        ({ id, body }: { id: string; body: FirebaseEngagementFragment }) =>
            updateEngagementActivity(id, body),
        {
            retry: 3, // Attempt to send request 3 times if fail
            onSuccess: () => {
                // Invalidate the engagee's notifications so they refresh.
                queryClient.invalidateQueries(['engagementActivity', engageeId])
            },
        }
    )
}
