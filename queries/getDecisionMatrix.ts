import { useQuery } from 'react-query'

import API from '../lib/axios/axios'

const getDecisionMatrix = async (decision: string, context: string) => {
    try {
        const { data } = await API.post(
            `/decisionMatrix?decision=${decision}&context=${context}`
        )
        return data
    } catch (error) {
        console.log(error)
    }
}

// Custom Query hooks
export const useDecisionMatrix = (decision: string, context: string) =>
    useQuery([decision, context], () => getDecisionMatrix(decision, context))
