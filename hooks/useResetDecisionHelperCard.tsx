import { useEffect, useRef } from 'react'
import { Control, useWatch } from 'react-hook-form'

import {
    setClickedConnect,
    setSideCardStep,
} from '../features/decision/decisionSlice'
import { useAppDispatch } from './useRedux'

const useResetDecisionHelperCard = (control: Control) => {
    const isMounted = useRef(false)
    const watchQuestion = useWatch({ name: 'question', control })

    useEffect(() => {
        if (isMounted.current) {
            useAppDispatch(setSideCardStep(1))
            useAppDispatch(setClickedConnect(false))
        } else {
            isMounted.current = true
        }
    }, [watchQuestion])
}

export default useResetDecisionHelperCard
