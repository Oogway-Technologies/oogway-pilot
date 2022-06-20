import { useMutation } from 'react-query'

import API from '../lib/axios/axios'
interface Question {
    decision: string
    context: string
}

const getDecisionMatrix = async (item: Question) => {
    try {
        const res = await API.post(
            `ai/decisionMatrix?decision=${item.decision}&context=${item.context}`
        )
        return res
    } catch (error) {
        return error
    }
}

// Custom Query hooks
export const useDecisionMatrix = () => {
    return useMutation((item: Question) => getDecisionMatrix(item), {
        retry: 3,
    })
}
