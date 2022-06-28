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
import { Options } from '../../../utils/types/global'
import { ProgressBar } from '../../Utils/common/ProgressBar'

const OptionRatingTabWrapper: FC = () => {
    const selectedTab = useAppSelector(
        state => state.decisionSlice.decisionEngineOptionTab
    )
    const ratingTabChecker = useAppSelector(
        state => state.decisionSlice.ratingTabChecker
    )
    const { control, watch, getValues } = useFormContext()
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
            <div className={`mb-4 flex w-full items-center space-x-3`}>
                <ProgressBar
                    totalSteps={
                        getValues('options').filter(
                            (item: Options) => item.name && item
                        ).length
                    }
                    currentStep={selectedTab + 1}
                    alignVertical
                    separator="/"
                />
            </div>
            <div
                className={
                    'mr-auto flex w-full items-center justify-self-start overflow-x-auto'
                }
            >
                {fields.map((item, index) => {
                    return watchOptions[index].name ? (
                        <span
                            key={item.id}
                            onClick={() => handleClick(index)}
                            className={`${optionRatingTab.itemContainer} ${
                                selectedTab === index
                                    ? 'border border-neutral-800 bg-neutral-50 text-neutral-800'
                                    : 'border border-neutralDark-150 text-neutralDark-150 first:border-r-transparent last:border-l-transparent'
                            } ${isMobile ? 'px-2 py-1.5' : 'px-4 py-2.5'}`}
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
