import { useMutation, useQuery, useQueryClient } from 'react-query'

import API from '../lib/axios/axios'
import {
    FirebaseDecisionContext,
    FirebaseDecisionCriteriaInfo,
} from '../utils/types/firebase'

/**
 * GET hooks
 */
export type getDecisionCriteriaInfoParams = {
    _version: 'v1' // currently only available version, add more later
    _option: string
    _criterion: string | undefined
    _decision?: string
}

type getDecisionCriteriaInfoPayload = {
    results: FirebaseDecisionCriteriaInfo | null
    err: string | null
}

// API fetch wrapper
export const getDecisionCriteriaInfo = async (
    params: getDecisionCriteriaInfoParams
): Promise<getDecisionCriteriaInfoPayload> => {
    // Creaate id from params
    const { _option, _version, _criterion } = params
    const id = `${_version}-${_option}-${_criterion}`

    // Call api
    const response = await API.get(`cacheDecisionCriteriaInfo/${id}`).catch(
        error => {
            console.log(error.toJSON())
            return { data: 'There was an error.' }
        }
    )

    return response.data
}

export const useDecisionCriteriaInfoQuery = (
    params: getDecisionCriteriaInfoParams
) =>
    useQuery(
        [
            'cacheDecisionCriteriaInfo',
            params._version,
            params._option,
            params._criterion,
        ],
        () => getDecisionCriteriaInfo(params),
        {
            cacheTime: 1000 * 60 * 15, // 15 minutes
            staleTime: 1000 * 60 * 30, // 30 minutes
        }
    )

/**
 * PUT hooks
 */
interface putDecisionCriteriaInfoParams extends getDecisionCriteriaInfoParams {
    decisionCriteriaInfo: FirebaseDecisionCriteriaInfo
}

export const cacheDecisionCriteriaInfo = async (
    params: putDecisionCriteriaInfoParams
) => {
    // Creaate id from params
    const { _option, _version, _criterion, decisionCriteriaInfo } = params
    const id = `${_version}-${_option}-${_criterion}`

    return API.put(
        `cacheDecisionCriteriaInfo/${id}`,
        decisionCriteriaInfo
    ).catch(error => {
        console.log(error.toJSON())
        return { data: 'There was an error.' }
    })
}

export const usePutDecisionCriteriaInfo = () => {
    return useMutation((params: putDecisionCriteriaInfoParams) =>
        cacheDecisionCriteriaInfo(params)
    )
}

/**
 * POST hooks
 */

export type DecisionCriteriaInfoPayload = {
    version: 'v1'
    token: string
    decisionContext: FirebaseDecisionContext
}

export const createDecisionCriteriaInfo = async (
    params: getDecisionCriteriaInfoParams
) => {
    return API.get('ai/decisionCriteriaInfo', { params: params }).catch(
        error => {
            console.log(error.toJSON())
            return { data: 'There was an error' }
        }
    )
}

export const useCreateDecisionCriteriaInfo = () => {
    const queryClient = useQueryClient()
    const cache = usePutDecisionCriteriaInfo()

    return useMutation(
        (params: getDecisionCriteriaInfoParams) =>
            createDecisionCriteriaInfo(params),
        {
            onSuccess: (newInfo, params) => {
                const { _version, _option, _criterion } = params

                // Cache result in Firebase
                const cacheParams = {
                    _version,
                    _option,
                    _criterion,
                    decisionCriteriaInfo: newInfo.data,
                }
                cache.mutate(cacheParams)

                // Cache query with unique version-option-criterion key
                // Directly update query with info returned from POST result
                queryClient.setQueryData(
                    [
                        'cacheDecisionCriteriaInfo',
                        _version,
                        _option,
                        _criterion,
                    ],
                    newInfo.data
                )
            },
        }
    )
}
