import { useMutation } from 'react-query'

import API from '../lib/axios/axios'

/**
 * POST Hooks
 */
interface Decision {
    question: string
    context: string
}

export const createDecisionMatrix = async (decisionBody: Decision) =>
    API.post('ai/decisionMatrix', decisionBody)

// Custom Query hooks
export const useCreateDecisionMatrix = () => {
    return useMutation(
        (decisionBody: Decision) => createDecisionMatrix(decisionBody),
        {
            retry: 1,
        }
    )
}
