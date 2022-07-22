import { useUser } from '@auth0/nextjs-auth0'
import {
    UilHistory,
    UilPlusCircle,
    UilQuestionCircle,
} from '@iconscout/react-unicons'
import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'

import {
    handleResetState,
    setDecisionHistoryModal,
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
    const { currentTab, decisionHistoryModal } = useAppSelector(
        state => state.decisionSlice
    )
    const { user } = useUser()

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

    const handleHistory = () => {
        useAppDispatch(setDecisionHistoryModal(!decisionHistoryModal))
    }

    return (
        <BaseCard
            className={`my-1 mx-auto flex items-center rounded-lg p-4 dark:bg-neutralDark-300  ${
                isMobile ? 'w-[99%]' : 'w-[98%]'
            }`}
        >
            {user && (
                <div
                    id={'question-bar-id'}
                    className="ml-auto flex cursor-pointer items-center space-x-2"
                    onClick={handleHistory}
                >
                    <UilHistory
                        className={'fill-neutral-700 dark:fill-white'}
                    />
                    <span
                        className={`${bodySmall} text-neutral-700 dark:text-white`}
                    >
                        Decision History
                    </span>
                </div>
            )}
            <div
                className={`${
                    user ? 'ml-3' : 'ml-auto'
                } flex cursor-pointer items-center space-x-2`}
                onClick={handleReset}
            >
                <UilPlusCircle className={'fill-neutral-700 dark:fill-white'} />
                <span
                    className={`${bodySmall} text-neutral-700 dark:text-white`}
                >
                    New Decision
                </span>
            </div>
            {currentTab !== 5 && (
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
            )}
        </BaseCard>
    )
}
