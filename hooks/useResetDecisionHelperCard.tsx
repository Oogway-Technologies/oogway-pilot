import { useEffect, useRef } from 'react'
import { Control, useWatch } from 'react-hook-form'

import {
    setClickedConnect,
    setSideCardStep,
} from '../features/decision/decisionSlice'
import { useAppDispatch, useAppSelector } from './useRedux'

const useResetDecisionHelperCard = (control: Control) => {
    const isMounted = useRef(false)
    const isDecisionFormUpdating = useAppSelector(
        state => state.decisionSlice.isDecisionFormUpdating
    )

    const watchQuestion = useWatch({ name: 'question', control })
    useEffect(() => {
        if (isMounted.current) {
            if (!isDecisionFormUpdating) {
                useAppDispatch(setSideCardStep(1))
                useAppDispatch(setClickedConnect(false))
            }
        } else {
            isMounted.current = true
        }
    }, [watchQuestion, isDecisionFormUpdating])
}

export default useResetDecisionHelperCard
