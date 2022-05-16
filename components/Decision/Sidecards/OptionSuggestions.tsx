import { UilSpinner } from '@iconscout/react-unicons'
import React from 'react'
import { useFormContext } from 'react-hook-form'

import { removeSelectedOption } from '../../../features/decision/decisionSlice'
import useMediaQuery from '../../../hooks/useMediaQuery'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { bodyHeavy } from '../../../styles/typography'
import { deepCopy } from '../../../utils/helpers/common'
import AISidebar from '../common/AISidebar'
import { SuggestionItem } from '../common/SuggestionItem'

export const OptionSuggestions = () => {
    const optionsList = useAppSelector(
        state => state.decisionSlice.suggestions.optionsList
    )
    const loadingAiSuggestions = useAppSelector(
        state => state.decisionSlice.loadingAiSuggestions
    )
    const isSuggestionsEmpty = useAppSelector(
        state => state.decisionSlice.isSuggestionsEmpty
    )
    const { getValues, setValue } = useFormContext()
    const isMobile = useMediaQuery('(max-width: 965px)')

    const handleItemAdd = (item: {
        name: string
        weight?: number
        isAI: boolean
    }) => {
        const optionArray = getValues('options')
        if (optionArray.length < 5) {
            useAppDispatch(removeSelectedOption(item))
            if (optionArray[0].name && !optionArray[1].name) {
                optionArray[1] = item
                setValue(
                    'options',
                    deepCopy([...optionArray, { name: '', isAI: false }])
                )
            } else if (!optionArray[0].name) {
                optionArray[0] = item
                setValue('options', deepCopy([...optionArray]))
            } else {
                setValue('options', deepCopy([item, ...optionArray]))
            }
        } else {
            if (!optionArray[4].name) {
                useAppDispatch(removeSelectedOption(item))
                optionArray[4] = item
                setValue('options', deepCopy([...optionArray]))
            }
        }
    }

    return (
        <AISidebar title={'AI Suggestions'} infoCircle>
            <>
                {optionsList.length && !loadingAiSuggestions
                    ? !isMobile && (
                          <span className="text-base font-normal leading-6 text-neutral-700 dark:text-neutralDark-150">
                              Click on the listed items to auto-fill.
                          </span>
                      )
                    : null}
                <div
                    className={`flex w-full max-h-[320px] overflow-auto ${
                        isMobile
                            ? 'items-center space-x-2'
                            : 'flex-col space-y-2'
                    }`}
                >
                    {loadingAiSuggestions && (
                        <UilSpinner className={'my-3 mx-auto animate-spin'} />
                    )}
                    {!optionsList.length && !loadingAiSuggestions && (
                        <span className="mt-4 text-sm font-normal text-center text-neutral-700 dark:text-neutralDark-150">
                            No more suggestions.
                        </span>
                    )}
                    {isSuggestionsEmpty && (
                        <>
                            <span
                                className={`${bodyHeavy} text-center mx-auto mt-4`}
                            >
                                Oogway AI cannot help with this decision.
                            </span>
                            <span className="mt-4 text-sm font-normal text-center text-neutral-700 dark:text-neutralDark-150">
                                {`It’s a work in progress and it’s learning to serve better suggestions with each decision you make.`}
                            </span>
                        </>
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
            </>
        </AISidebar>
    )
}
