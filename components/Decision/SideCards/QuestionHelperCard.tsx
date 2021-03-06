import { UilPlusCircle, UilQuestionCircle } from '@iconscout/react-unicons'
import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'

import {
    handleResetState,
    setInfoModal,
    setInfoModalDetails,
} from '../../../features/decision/decisionSlice'
import useMediaQuery from '../../../hooks/useMediaQuery'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { bodySmall } from '../../../styles/typography'
import { decisionInfo } from '../../../utils/constants/global'
import { BaseCard } from '../common/BaseCard'

interface QuestionHelperCardProps {
    title: string
}

export const QuestionHelperCard: FC<QuestionHelperCardProps> = ({
    title,
}: QuestionHelperCardProps) => {
    const { reset } = useFormContext()
    const isMobile = useMediaQuery('(max-width: 965px)')
    const { currentTab } = useAppSelector(state => state.decisionSlice)

    const handleInfoClick = () => {
        useAppDispatch(
            setInfoModalDetails({
                title: title.replace('your ', ''),
                context: decisionInfo[currentTab],
            })
        )
        useAppDispatch(setInfoModal(true))
    }

    const handleReset = () => {
        reset()
        useAppDispatch(handleResetState())
    }
    return (
        <BaseCard
            className={`my-1 mx-auto flex items-center rounded-lg p-4 dark:bg-neutralDark-300  ${
                isMobile ? 'w-[99%]' : 'w-[98%]'
            }`}
        >
            <div
                id={'question-bar-id'}
                className="ml-auto flex cursor-pointer items-center space-x-2"
                onClick={handleReset}
            >
                <UilPlusCircle className={'fill-neutral-700 dark:fill-white'} />
                <span
                    className={`${bodySmall} text-neutral-700 dark:text-white`}
                >
                    New Decision
                </span>
            </div>
            <div
                className="ml-3 flex cursor-pointer items-center space-x-2"
                onClick={handleInfoClick}
            >
                <UilQuestionCircle
                    className={'fill-neutral-700 dark:fill-white'}
                />
                <span
                    className={`${bodySmall} text-neutral-700 dark:text-white`}
                >
                    Explain
                </span>
            </div>
        </BaseCard>
    )
}
