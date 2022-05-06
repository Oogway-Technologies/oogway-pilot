import React, { FC } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'

import {
    setDecisionEngineOptionTab,
    setRatingTabChecker,
} from '../../../features/decision/decisionSlice'
import useMediaQuery from '../../../hooks/useMediaQuery'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { optionRatingTab } from '../../../styles/decision'

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
    }
    return (
        <div className={optionRatingTab.container}>
            {fields.map((item, index) => {
                return watchOptions[index].name ? (
                    <span
                        key={item.id}
                        onClick={() => handleClick(index)}
                        className={`text-base md:text-lg not-italic font-bold tracking-normal ${
                            optionRatingTab.itemContainer
                        } ${
                            selectedTab === index
                                ? 'text-primary border-primary dark:text-primaryDark dark:border-primaryDark border-b-2'
                                : 'font-normal text-neutral-700 dark:text-neutral-300 border-b-2 border-transparent'
                        } ${isMobile ? ' py-1' : ' py-3'}`}
                    >
                        {watchOptions[index].name}
                    </span>
                ) : null
            })}
        </div>
    )
}

export default OptionRatingTabWrapper
