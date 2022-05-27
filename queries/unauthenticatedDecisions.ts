import { useMutation, useQuery, useQueryClient } from 'react-query'

import API from '../lib/axios/axios'
import { cyrb53 } from '../utils/helpers/common'
import { FirebaseUnauthenticatedDecision } from '../utils/types/firebase'

/**
 * GET hooks
 */
export type getUnauthenticatedDecisionParams = {
    _ipAddress: string | undefined
}

export type getUnauthenticatedDecisionPayload = {
    results: FirebaseUnauthenticatedDecision | null
    err: string | null
}

// API fetch wrapper
export const getUnauthenticedDecision = async (
    params: getUnauthenticatedDecisionParams
): Promise<getUnauthenticatedDecisionPayload> => {
    // Creaate id from params
    const { _ipAddress } = params
    if (!_ipAddress) return { results: null, err: 'Device IP is missing.' }
    const id = cyrb53(_ipAddress) // convert params to 53-bit hash ID

    // Call api
    const response = await API.get(`unauthenticatedDecisions/${id}`).catch(
        error => {
            console.log(error.toJSON())
            return { data: 'There was an error.' }
        }
    )

    return response.data
}

export const useUnauthenticatedDecisionQuery = (
    ipAddress: string | undefined,
    onSettled?: (data: any) => void
) => {
    const params: getUnauthenticatedDecisionParams = {
        _ipAddress: ipAddress,
    }
    return useQuery(
        ['unauthenticatedDecisions', ipAddress],
        () => getUnauthenticedDecision(params),
        {
            onSettled: onSettled,
        }
    )
}
/**
 * PUT hooks
 */
export interface putUnauthenticatedDecisionParams
    extends getUnauthenticatedDecisionParams {
    unauthenticatedDecision: FirebaseUnauthenticatedDecision
}

export const cacheUnauthenticatedDecisions = async (
    params: putUnauthenticatedDecisionParams
) => {
    // Creaate id from params
    const { _ipAddress, unauthenticatedDecision } = params
    if (!_ipAddress) return { data: 'Device IP is missing.' }
    const id = cyrb53(_ipAddress)

    return API.put(
        `unauthenticatedDecisions/${id}`,
        unauthenticatedDecision
    ).catch(error => {
        console.log(error.toJSON())
        return { data: 'There was an error.' }
    })
}

export const usePutUnauthenticatedDecision = () => {
    const queryClient = useQueryClient()

    return useMutation(
        (params: putUnauthenticatedDecisionParams) =>
            cacheUnauthenticatedDecisions(params),
        {
            onSuccess: (results, params) => {
                queryClient.invalidateQueries([
                    'unauthenticatedDecisions',
                    params._ipAddress,
                ])
            },
        }
    )
}
