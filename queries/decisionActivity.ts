import { useMutation } from 'react-query'

import API from '../lib/axios/axios'
import { FirebaseDecisionActivity } from '../utils/types/firebase'

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
