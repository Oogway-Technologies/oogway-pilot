import { UilInfoCircle, UilSpinner } from '@iconscout/react-unicons'
import React from 'react'
import { useFormContext } from 'react-hook-form'

import { removeSelectedOption } from '../../../features/decision/decisionSlice'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { SuggestionItem } from './SuggestionItem'

export const OptionSuggestions = () => {
    const optionsList = useAppSelector(
        state => state.decisionSlice.suggestions.optionsList
    )
    const { getValues, setValue } = useFormContext()

    const handleItemAdd = (item: {
        name: string
        weight?: number
        isAI: boolean
    }) => {
        const optionArray = getValues('options')
        if (optionArray.length < 5) {
            useAppDispatch(removeSelectedOption(item))
            setValue('options', [...optionArray, item])
        }
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
                Click To Auto-fill
            </span>

            <div
                className={`flex overflow-auto flex-col space-y-2 w-full scrollbar-hide max-h-[320px]`}
            >
                {!optionsList.length && (
                    <div className="flex justify-center items-center m-4">
                        <UilSpinner className={'m-auto animate-spin'} />
                    </div>
                )}
                {optionsList.map((item, index) => {
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
