import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { handleResetState } from '../features/decision/decisionSlice'
import { DecisionForm } from '../utils/types/global'
import { useAppDispatch } from './useRedux'

const useInstantiateDecisionForm = () => {
    // Rehydrate form state from stored values
    const methods = useForm<DecisionForm>({
        defaultValues: {
            question: '',
            context: '',
            options: [{ name: '', isAI: false }],
            criteria: [{ name: '', weight: 2, isAI: false }],
            ratings: [
                {
                    option: '',
                    score: '',
                    rating: [{ criteria: '', value: 0, weight: 1 }],
                },
            ],
        },
    })

    // Clear redux state on unmount
    useEffect(() => {
        return () => {
            // Wipe previous decision question and id
            useAppDispatch(handleResetState())
        }
    }, [])

    // Return form methods
    return methods
}

export default useInstantiateDecisionForm
