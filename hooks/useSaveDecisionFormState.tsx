import { useEffect, useRef } from 'react'

import { useCreateDecisionActivity } from '../queries/decisionActivity'
import { useAppSelector } from './useRedux'

const useSaveDecisionFormState = () => {
    const { decisionFormState, decisionActivityId } = useAppSelector(
        state => state.decisionSlice
    )

    // Track redux form  state updates in ref
    const decisionFormStateRef = useRef(decisionFormState)
    useEffect(() => {
        decisionFormStateRef.current = decisionFormState
    }, [decisionFormState])

    const decisionActivityIdRef = useRef(decisionActivityId)
    useEffect(() => {
        decisionActivityIdRef.current = decisionActivityId
    }, [decisionActivityId])

    // On unmount, save form state
    const updateDecision = useCreateDecisionActivity()
    useEffect(() => {
        return () => {
            if (decisionActivityIdRef.current) {
                updateDecision.mutate(decisionFormStateRef.current)
            }
        }
    }, [])
}

export default useSaveDecisionFormState
