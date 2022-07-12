import { useMutation } from 'react-query'

import API from '../lib/axios/axios'

/**
 * POST hooks
 */
interface Decision {
    decision: string
    context: string
}

export const createInfoCard = async (decisionBody: Decision) =>
    API.post('ai/infoCard', decisionBody)

export const useCreateInfoCard = () => {
    return useMutation(
        (decisionBody: Decision) => createInfoCard(decisionBody),
        {
            retry: 2,
        }
    )
}
