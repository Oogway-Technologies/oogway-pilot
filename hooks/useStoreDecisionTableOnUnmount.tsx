import { useEffect } from 'react'
import { FieldValues, UseFormWatch } from 'react-hook-form'

import { setDecisionFormState } from '../features/decision/decisionSlice'
import { DecisionForm } from '../utils/types/global'
import { useAppDispatch } from './useRedux'

const useStoreDecisionTableOnUnmount = (
    // control: Control
    watch: UseFormWatch<FieldValues>
) => {
    // const decisionFormState = useWatch({ control: control })
    const decisionFormState = watch()

    // On unmount, store current decisionFormState in global variable
    useEffect(() => {
        return () => {
            console.log(decisionFormState)
            useAppDispatch(
                setDecisionFormState(decisionFormState as DecisionForm)
            )
        }
    }, [])
}

export default useStoreDecisionTableOnUnmount
