import { UilInfoCircle } from '@iconscout/react-unicons'
import React from 'react'
import { useFormContext } from 'react-hook-form'

import { removeSelectedCriteria } from '../../../features/decision/decisionSlice'
import useMediaQuery from '../../../hooks/useMediaQuery'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { deepCopy } from '../../../utils/helpers/common'
import { SuggestionItem } from './SuggestionItem'

export const CriteriaSuggestions = () => {
    const criteriaList = useAppSelector(
        state => state.decisionSlice.suggestions.criteriaList
    )
    const { getValues, setValue } = useFormContext()
    const isMobile = useMediaQuery('(max-width: 965px)')

    const handleItemAdd = (item: {
        name: string
        weight?: number
        isAI: boolean
    }) => {
        const optionArray = getValues('criteria')
        useAppDispatch(removeSelectedCriteria(item))
        setValue('criteria', deepCopy([item, ...optionArray]))
    }

    return (
        <div
            className={
                'flex flex-col bg-white dark:bg-neutralDark-500 md:py-4 md:px-3 md:mb-4 md:rounded-2xl md:shadow-md md:dark:shadow-black/60'
            }
        >
            <div className="flex items-center">
                <span
                    className={
                        'text-base font-bold leading-6 text-primary dark:text-primaryDark md:mb-3 md:text-2xl'
                    }
                >
                    AI Suggestions
                </span>
                {!isMobile && (
                    <UilInfoCircle
                        className={
                            'justify-self-end ml-auto fill-neutral-700 dark:fill-neutralDark-150'
                        }
                    />
                )}
            </div>
            {!isMobile && (
                <span className="text-base font-normal leading-6 text-neutral-700 dark:text-neutralDark-150">
                    Click on the listed items to auto-fill
                </span>
            )}
            <div
                className={`flex overflow-auto items-center space-x-2 w-full max-h-[320px] md:flex-col md:space-y-2 scrollbar-hide`}
            >
                {!criteriaList.length && (
                    <span className="mt-4 text-sm font-normal text-center text-neutral-700 dark:text-neutralDark-150">
                        Empty list
                    </span>
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
