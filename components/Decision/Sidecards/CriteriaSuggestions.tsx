import React from 'react'
import { useFormContext } from 'react-hook-form'

import { removeSelectedCriteria } from '../../../features/decision/decisionSlice'
import useMediaQuery from '../../../hooks/useMediaQuery'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { bodyHeavy } from '../../../styles/typography'
import { deepCopy } from '../../../utils/helpers/common'
import AISidebar from '../common/AISidebar'
import { SuggestionItem } from '../common/SuggestionItem'

export const CriteriaSuggestions = () => {
    const criteriaList = useAppSelector(
        state => state.decisionSlice.suggestions.criteriaList
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
        const optionArray = getValues('criteria')
        useAppDispatch(removeSelectedCriteria(item))
        setValue('criteria', deepCopy([item, ...optionArray]))
    }

    return (
        <AISidebar title={'AI Suggestions'}>
            <>
                {criteriaList.length
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
                    {!criteriaList.length && !loadingAiSuggestions && (
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
                                {`It's a work in progress and it's learning to serve better suggestions with each decision you make.`}
                            </span>
                        </>
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
            </>
        </AISidebar>
    )
}
