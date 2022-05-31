import { UilQuestionCircle } from '@iconscout/react-unicons'
import React from 'react'
import { useFormContext } from 'react-hook-form'

import { removeSelectedCriteria } from '../../../features/decision/decisionSlice'
import useMediaQuery from '../../../hooks/useMediaQuery'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { body, bodyHeavy } from '../../../styles/typography'
import { deepCopy } from '../../../utils/helpers/common'
import AISidebar from '../common/AISidebar'
import { SuggestionItem } from '../common/SuggestionItem'

export const CriteriaSuggestions = () => {
    const {
        isSuggestionsEmpty,
        loadingAiSuggestions,
        suggestions: { criteriaList },
    } = useAppSelector(state => state.decisionSlice)

    const { getValues, setValue } = useFormContext()
    const isMobile = useMediaQuery('(max-width: 965px)')

    const handleItemAdd = (item: {
        name: string
        weight?: number
        isAI: boolean
    }) => {
        const optionArray = getValues('criteria')
        useAppDispatch(removeSelectedCriteria(item))
        setValue('criteria', deepCopy([...optionArray, item]))
    }

    return (
        <AISidebar title={'AI Suggestions'} infoCircle>
            <>
                {criteriaList.length
                    ? !isMobile && (
                          <span
                              className={`${body} text-neutral-700 dark:text-neutralDark-150`}
                          >
                              Click on suggestion to auto-fill
                          </span>
                      )
                    : null}
                <div
                    className={`flex w-full max-h-[320px] overflow-auto ${
                        isMobile && criteriaList.length && !loadingAiSuggestions
                            ? 'items-center space-x-5'
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
                            <div
                                key={`criteria-list-item-${index}`}
                                className={'flex items-center mt-4 w-full'}
                            >
                                <SuggestionItem
                                    suggestionItem={item}
                                    onClick={handleItemAdd}
                                />
                                <div className=" group flex justify-center items-center p-2 ml-2 h-full hover:bg-primary hover:dark:bg-primaryDark rounded-lg border border-neutral-300 transition-all cursor-pointer">
                                    <UilQuestionCircle className=" min-w-[20px] min-h-[20px] fill-neutral-300 group-hover:fill-white" />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </>
        </AISidebar>
    )
}
