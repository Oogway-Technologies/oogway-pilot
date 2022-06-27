import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'

import {
    setIsQuestionSafeForAI,
    setUserIgnoredUnsafeWarning,
} from '../../../features/decision/decisionSlice'
import useMediaQuery from '../../../hooks/useMediaQuery'
import { useAppDispatch } from '../../../hooks/useRedux'
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

    const handleReconsider = () => {
        reset() // reset form state
        useAppDispatch(setIsQuestionSafeForAI(true))
        useAppDispatch(setUserIgnoredUnsafeWarning(false))
        setCurrentTab(0)
        setMatrixStep(0)
    }

    return (
        <AISidebar
            title={'Decision Unsupported'}
            className={
                isMobile
                    ? 'sticky -mx-1 top-11 pt-1 dark:bg-neutralDark-600 bg-neutral-25 z-50'
                    : ''
            }
        >
            <div className="flex flex-col">
                <div
                    className={`${bodySmall} text-center text-neutral-800 mt-4 mb-6 dark:text-white`}
                >
                    Sorry, this decision violates our policies for content
                    safety and AI cannot provide any information. We recommend
                    you reconsider this decision.
                </div>
                <div className="mx-auto">
                    <Button
                        keepText
                        text="Reconsider"
                        className={`border border-primary dark:border-primaryDark  dark:bg-primaryDark dark:text-white text-primary bg-transparent w-36 py-2 ${bodyHeavy} rounded justify-center`}
                        onClick={handleReconsider}
                    />
                </div>
            </div>
        </AISidebar>
    )
}

export default UnsupportedDecision
