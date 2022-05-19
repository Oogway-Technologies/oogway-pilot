import { useMutation, useQuery, useQueryClient } from 'react-query'

import API from '../lib/axios/axios'
import { cyrb53 } from '../utils/helpers/common'
import {
    FirebaseDecisionContext,
    FirebaseDecisionCriteriaInfo,
} from '../utils/types/firebase'
import { jsonTimeObj } from '../utils/types/global'

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
    timestamp?: jsonTimeObj
    err: string | null
}

// API fetch wrapper
export const getDecisionCriteriaInfo = async (
    params: getDecisionCriteriaInfoParams
): Promise<getDecisionCriteriaInfoPayload> => {
    // Creaate id from params
    const { _option, _version, _criterion } = params
    const id = cyrb53(`${_version}-${_option}-${_criterion}`) // convert params to 53-bit hash ID

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
    version: 'v1',
    option: string,
    criterion: string,
    onSettled?: (data: any) => void
) => {
    const params: getDecisionCriteriaInfoParams = {
        _version: version,
        _option: option,
        _criterion: criterion,
    }
    return useQuery(
        ['cacheDecisionCriteriaInfo', version, option, criterion],
        () => getDecisionCriteriaInfo(params),
        {
            cacheTime: 1000 * 60 * 5, // 15 minutes
            staleTime: 1000 * 30 * 1, //  30 seconds
            onSettled: onSettled,
        }
    )
}
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
    const id = cyrb53(`${_version}-${_option}-${_criterion}`)

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
