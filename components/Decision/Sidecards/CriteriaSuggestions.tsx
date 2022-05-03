import { UilInfoCircle, UilSpinner } from '@iconscout/react-unicons'
import React from 'react'
import { useFormContext } from 'react-hook-form'

import { removeSelectedCriteria } from '../../../features/decision/decisionSlice'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { SuggestionItem } from './SuggestionItem'

export const CriteriaSuggestions = () => {
    const criteriaList = useAppSelector(
        state => state.decisionSlice.suggestions.criteriaList
    )
    const { getValues, setValue } = useFormContext()

    const handleItemAdd = (item: {
        name: string
        weight?: number
        isAI: boolean
    }) => {
        const optionArray = getValues('criteria')
        useAppDispatch(removeSelectedCriteria(item))
        setValue('criteria', [...optionArray, item])
    }

    return (
        <div className="flex flex-col py-4 px-3 my-4 bg-white dark:bg-neutralDark-500 rounded-2xl shadow-md dark:shadow-black/60">
            <div className="flex items-center mb-3">
                <span className="text-2xl font-bold leading-6 text-primary dark:text-primaryDark">
                    AI Suggestions
                </span>
                <UilInfoCircle
                    className={
                        'justify-self-end ml-auto fill-neutral-700 dark:fill-neutralDark-150'
                    }
                />
            </div>
            <span className="text-base font-normal leading-6 text-neutral-700 dark:text-neutralDark-150">
                Click on the listed criterias to Auto-fill
            </span>

            <div
                className={`flex overflow-auto flex-col space-y-2 w-full scrollbar-hide max-h-[320px]`}
            >
                {!criteriaList.length && (
                    <div className="flex justify-center items-center m-4">
                        <UilSpinner className={'m-auto animate-spin'} />
                    </div>
                )}
                {criteriaList.map((item, index) => {
                    return (
                        <SuggestionItem
                            key={item.name + index}
                            suggestionItem={item}
                            onClick={handleItemAdd}
                        />
                    )
                })}
            </div>
        </div>
    )
}
