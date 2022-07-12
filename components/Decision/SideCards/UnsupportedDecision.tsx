import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'

import {
    setClickedConnect,
    setDecisionActivityId,
    setDecisionFormState,
    setDecisionQuestion,
    setInfoCards,
    setIsDecisionRehydrated,
    setIsQuestionSafeForAI,
    setSideCardStep,
    setUserIgnoredUnsafeWarning,
} from '../../../features/decision/decisionSlice'
import useMediaQuery from '../../../hooks/useMediaQuery'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { useDeleteDecisionActivity } from '../../../queries/decisionActivity'
import { bodyHeavy, bodySmall } from '../../../styles/typography'
import Button from '../../Utils/Button'
import AISidebar from '../common/AISidebar'

type UnsupportedDecisionProps = {
    setCurrentTab: (n: number) => void
    setMatrixStep: (n: number) => void
}

const UnsupportedDecision: FC<UnsupportedDecisionProps> = ({
    setCurrentTab,
    setMatrixStep,
}) => {
    const { reset } = useFormContext()
    const isMobile = useMediaQuery('(max-width: 965px)')
    const decisionActivityId = useAppSelector(
        state => state.decisionSlice.decisionActivityId
    )
    const deleteDecisionActivity = useDeleteDecisionActivity()

    const handleReconsider = () => {
        if (decisionActivityId)
            deleteDecisionActivity.mutate(decisionActivityId)
        reset() // reset form state
        useAppDispatch(setIsQuestionSafeForAI(true))
        useAppDispatch(setUserIgnoredUnsafeWarning(false))
        useAppDispatch(setDecisionActivityId(undefined))
        useAppDispatch(setDecisionQuestion(undefined))
        useAppDispatch(setSideCardStep(1))
        useAppDispatch(setClickedConnect(false))
        useAppDispatch(setDecisionFormState({}))
        useAppDispatch(setIsDecisionRehydrated(false))
        useAppDispatch(setInfoCards(undefined))
        setCurrentTab(0)
        setMatrixStep(0)
    }

    return (
        <AISidebar
            title={'Decision Unsupported'}
            className={
                isMobile
                    ? 'sticky top-11 z-50 -mx-1 bg-neutral-25 pt-1 dark:bg-neutralDark-600'
                    : ''
            }
        >
            <div className="flex flex-col">
                <div
                    className={`${bodySmall} mt-4 mb-6 text-center text-neutral-800 dark:text-white`}
                >
                    Sorry, this decision violates our policies for content
                    safety and AI cannot provide any information. We recommend
                    you reconsider this decision.
                </div>
                <div className="mx-auto">
                    <Button
                        keepText
                        text="Reconsider"
                        className={`w-36 border border-primary  bg-transparent py-2 text-primary dark:border-primaryDark dark:bg-primaryDark dark:text-white ${bodyHeavy} justify-center rounded`}
                        onClick={handleReconsider}
                    />
                </div>
            </div>
        </AISidebar>
    )
}

export default UnsupportedDecision
