import { useUser } from '@auth0/nextjs-auth0'
import React, { FC, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import {
    setDecisionCriteriaQueryKey,
    setIsRatingsModified,
} from '../../../features/decision/decisionSlice'
import useMediaQuery from '../../../hooks/useMediaQuery'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import {
    bodyHeavy,
    bodySmall,
    bodySmallHeavy,
} from '../../../styles/typography'
import Button from '../../Utils/Button'
import { CriteriaInfo } from '../SideCards/CriteriaInfo'
import AskAIButton from './AskAIButton'

interface RatingSelectorProps {
    title: string
    registerName: string
    highlight?: boolean
}

export const RatingSelector: FC<RatingSelectorProps> = ({
    registerName,
    title,
    highlight = false,
}: RatingSelectorProps) => {
    const [selected, setSelected] = useState(1)
    const isMobile = useMediaQuery('(max-width: 965px)')
    const { getValues, setValue } = useFormContext()
    const { user } = useUser()
    const { decisionCriteriaQueryKey } = useAppSelector(
        state => state.decisionSlice
    )

    useEffect(() => {
        setSelected(getValues(registerName))
    }, [registerName])

    const handleChange = (value: number) => {
        setSelected(value)
        setValue(registerName, value)
        useAppDispatch(setIsRatingsModified(true))
    }

    const colorGenerator = (index: number) => {
        switch (index) {
            case 1:
                return '#EFE9FF'
            case 2:
                return '#E0D4FF'
            case 3:
                return '#B294FF'
            case 4:
                return '#885AFE'
            case 5:
                return '#5A34BE'
            default:
                return '#EFE9FF'
        }
    }

    return (
        <div
            className={`flex relative flex-col ${
                isMobile ? 'p-3' : 'p-5'
            } space-y-2 w-full bg-white dark:bg-neutralDark-500 rounded-2xl custom-box-shadow dark:custom-box-shadow-dark`}
        >
            <div className="flex items-center">
                <span
                    className={`${isMobile ? bodySmallHeavy : bodyHeavy} ${
                        highlight
                            ? 'text-primary dark:text-primaryDark'
                            : 'text-neutral-700 dark:text-neutral-150'
                    }`}
                >
                    {title}{' '}
                </span>
                {user && (
                    <AskAIButton
                        className="justify-self-end ml-auto"
                        onClick={() =>
                            useAppDispatch(setDecisionCriteriaQueryKey(title))
                        }
                    />
                )}
            </div>
            <div
                className={`flex ${
                    isMobile ? 'justify-evenly p-2' : 'justify-between p-4'
                } items-center bg-white dark:bg-neutralDark-300 mt-12 w-full rounded-2xl custom-box-shadow dark:custom-box-shadow-dark`}
            >
                {!isMobile && (
                    <span
                        className={`${bodySmall} text-neutral-300 px-2.5 py-1 rounded border border-neutral-300`}
                    >
                        Not good
                    </span>
                )}
                {Array(5)
                    .fill(0)
                    .map((_, index) => {
                        const colorClass = selected >= index + 1 ? `` : ''
                        // 'bg-white dark:bg-neutralDark-300'
                        return (
                            <Button
                                key={`rating-button-${index}`}
                                addStyle={`${colorClass} ${bodyHeavy} rounded-lg border border-neutral-700 flex item-center py-2 px-3.5 ${
                                    selected >= index + 1
                                        ? 'text-white'
                                        : 'text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutralDark-300'
                                } dark:border-white`}
                                text={String(index + 1)}
                                onClick={() => {
                                    handleChange(index + 1)
                                }}
                                style={{
                                    backgroundColor: `${
                                        selected >= index + 1
                                            ? `${colorGenerator(selected)}`
                                            : ''
                                    }`,
                                    WebkitTextStroke: `1px ${
                                        selected >= index + 1
                                            ? '#535353'
                                            : 'transparent'
                                    }`,
                                }}
                                keepText
                            />
                        )
                    })}
                {!isMobile && (
                    <span
                        className={`${bodySmall} text-neutral-300 px-2.5 py-1 rounded border border-neutral-300`}
                    >
                        Excellent
                    </span>
                )}
            </div>
            {isMobile && (
                <div className="flex items-center pt-3 mt-3">
                    <span
                        className={`${bodySmall} text-neutral-300 px-2.5 py-1 rounded border border-neutral-300`}
                    >
                        Not good
                    </span>
                    <span
                        className={`${bodySmall} text-neutral-300 px-2.5 py-1 rounded border border-neutral-300 ml-auto`}
                    >
                        Excellent
                    </span>
                </div>
            )}
            {decisionCriteriaQueryKey && isMobile ? <CriteriaInfo /> : null}
        </div>
    )
}
