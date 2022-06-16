import axios from 'axios'
import { useQuery } from 'react-query'

const getDecisionMatrix = async (decision: string, context: string) => {
    const { data } = await axios.post(
        `/api/decisionMatrix?decision=${decision}&context=${context}`
    )
    return data
}

// Custom Query hooks
export const useDecisionMatrix = (decision: string, context: string) =>
    useQuery([decision, context], () => getDecisionMatrix(decision, context))
