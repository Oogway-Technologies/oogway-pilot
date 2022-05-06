import { useMutation, useQuery, useQueryClient } from 'react-query'

import API from '../lib/axios/axios'
import { OogwayDecisionAPI } from '../lib/axios/externalHandlers'
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
    _criterion: string
}

// API fetch wrapper
export const getDecisionCriteriaInfo = async (
    params: getDecisionCriteriaInfoParams
): Promise<FirebaseDecisionCriteriaInfo> => {
    // Creaate id from params
    const { _option, _version, _criterion } = params
    const id = `${_option}-${_version}-${_criterion}`

    // Call api
    const response = await API.get(`decisionCriteriaInfo/${id}`).catch(
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
            'decisionCriteriaInfo',
            params._version,
            params._option,
            params._criterion,
        ],
        () => getDecisionCriteriaInfo(params)
    )

/**
 * POST hooks
 */

type DecisionCriteriaInfoPayload = {
    version: string
    token: string
    decisionContext: FirebaseDecisionContext
}

export const createDecisionCriteriaInfo = async (
    decisionCriteriaInfoPayload: DecisionCriteriaInfoPayload
) => {
    // Unpack payload
    const { version, token, decisionContext } = decisionCriteriaInfoPayload
    const payload = {
        ...decisionContext,
        token,
    }
    return OogwayDecisionAPI.post(`oogway_ft/${version}`, payload)
}

export const useCreateDecisionCriteriaInfo = () => {
    const queryClient = useQueryClient()

    return useMutation(
        (decisionCriteriaInfoPayload: DecisionCriteriaInfoPayload) =>
            createDecisionCriteriaInfo(decisionCriteriaInfoPayload),
        {
            onSuccess: (newInfo, decisionCriteriaInfoPayload) => {
                const { version, decisionContext } = decisionCriteriaInfoPayload
                // Cache result in Firebase

                // Cache query with unique version-option-criterion key
                // Directly update query with info returned from POST result
                queryClient.setQueryData(
                    [
                        'decisionCriteriaInfo',
                        version,
                        decisionContext.option,
                        decisionContext.criterion,
                    ],
                    newInfo
                )
            },
        }
    )
}
