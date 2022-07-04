import { useInfiniteQuery, useMutation } from 'react-query'

import API from '../lib/axios/axios'
import { FirebaseDecisionActivity } from '../utils/types/firebase'
import { jsonTimeObj } from '../utils/types/global'

/**
 * Creation hooks
 */

export const createDecisionActivity = async (
    newDecisionActivity: FirebaseDecisionActivity
) => API.post('decisionActivity', newDecisionActivity)

export const useCreateDecisionActivity = () => {
    return useMutation(
        (newDecisionActivity: FirebaseDecisionActivity) =>
            createDecisionActivity(newDecisionActivity),
        {
            retry: 3,
        }
    )
}

/**
 * Retrieval hooks
 */

type getDecisionActivityPayload = {
    decisions: ReadonlyArray<FirebaseDecisionActivity>
    lastTimestamp: jsonTimeObj
    firstTimestamp: jsonTimeObj
    hasNextPage: boolean
}

type getDecisionActivityParams = {
    _index: 'timestamp'
    _order: 'asc' | 'desc'
    _after: number
    _size: number
    _isComplete?: boolean
    _userId: string
}

export const getDecisionActivity = async (
    pageParam = Math.floor(Date.now() / 1000),
    order: 'desc' | 'asc',
    size: number,
    userId: string,
    isComplete?: boolean
): Promise<getDecisionActivityPayload> => {
    // Create params
    const params: getDecisionActivityParams = {
        _index: 'timestamp',
        _order: order,
        _after: pageParam,
        _size: size,
        _userId: userId,
    }
    if (typeof isComplete !== 'undefined') params._isComplete = isComplete

    // Call api
    const response = await API.get('decisionActivity', {
        params: params,
    }).catch(error => {
        console.log(error.toJSON())
        return { data: 'There was an error' }
    })

    return response.data
}

export const useInfiniteDecisionsQuery = (
    userId: string,
    isComplete?: boolean,
    enabled?: boolean,
    onSuccess?: (data: any) => void
) =>
    useInfiniteQuery(
        ['decisionActivity', userId, isComplete],
        ({ pageParam }) =>
            getDecisionActivity(pageParam, 'desc', 5, userId, isComplete),
        {
            // Infinite query pagination
            getNextPageParam: lastPage =>
                (lastPage.hasNextPage && lastPage.lastTimestamp.seconds) ||
                undefined,
            onSuccess: onSuccess,
            // Other params
            staleTime: 1000 * 60 * 60, // One hour,
            refetchOnMount: 'always',
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            enabled: enabled ?? true,
        }
    )

/**
 * Delete hooks
 */

export const deleteDecisionActivity = (id: string) =>
    API.delete(`decisionActivity/${id}`)

export const useDeleteDecisionActivity = () => {
    return useMutation((id: string) => deleteDecisionActivity(id), {
        retry: 3,
    })
}
