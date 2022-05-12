import React, { FC } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'

import {
    setDecisionCriteriaQueryKey,
    setDecisionEngineOptionTab,
    setRatingTabChecker,
} from '../../../features/decision/decisionSlice'
import useMediaQuery from '../../../hooks/useMediaQuery'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { optionRatingTab } from '../../../styles/decision'
import { bodyHeavy } from '../../../styles/typography'

const OptionRatingTabWrapper: FC = () => {
    const selectedTab = useAppSelector(
        state => state.decisionSlice.decisionEngineOptionTab
    )
    const ratingTabChecker = useAppSelector(
        state => state.decisionSlice.ratingTabChecker
    )
    const { control, watch } = useFormContext()
    const { fields } = useFieldArray({
        control,
        name: 'options',
    })
    const watchOptions = watch('options')
    const isMobile = useMediaQuery('(max-width: 965px)')

    const handleClick = (index: number) => {
        useAppDispatch(setDecisionEngineOptionTab(index))
        const checkArray = [...ratingTabChecker]
        checkArray[index] = true
        useAppDispatch(setRatingTabChecker(checkArray))

        // Reset decisionInfo query key
        useAppDispatch(setDecisionCriteriaQueryKey(undefined))
    }
    return (
        <>
            <span
                className={`${bodyHeavy} text-neutral-800 dark:text-neutralDark-150`}
            >
                Options
            </span>
            <div className={optionRatingTab.container}>
                {fields.map((item, index) => {
                    return watchOptions[index].name ? (
                        <span
                            key={item.id}
                            onClick={() => handleClick(index)}
                            className={`${optionRatingTab.itemContainer} ${
                                selectedTab === index
                                    ? 'bg-primary dark:bg-primaryDark text-white rounded-lg'
                                    : 'text-primary dark:text-primaryDark'
                            } ${isMobile ? 'px-2 py-1' : 'px-3 py-2'}`}
                        >
                            {watchOptions[index].name}
                        </span>
                    ) : null
                })}
            </div>
        </>
    )
}

export default OptionRatingTabWrapper
