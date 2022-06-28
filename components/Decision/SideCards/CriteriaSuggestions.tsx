import { UilQuestionCircle } from '@iconscout/react-unicons'
import React from 'react'
import { useFormContext } from 'react-hook-form'

import {
    removeSelectedCriteria,
    setInfoCardSection,
} from '../../../features/decision/decisionSlice'
import useMediaQuery from '../../../hooks/useMediaQuery'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { body, bodyHeavy } from '../../../styles/typography'
import { deepCopy, insertAtArray } from '../../../utils/helpers/common'
import AISidebar from '../common/AISidebar'
import { SuggestionItem } from '../common/SuggestionItem'

export const CriteriaSuggestions = () => {
    const {
        isSuggestionsEmpty,
        loadingAiSuggestions,
        suggestions: { criteriaList },
        infoCardSection,
    } = useAppSelector(state => state.decisionSlice)

    const { getValues, setValue } = useFormContext()
    const isMobile = useMediaQuery('(max-width: 965px)')

    const handleItemAdd = (item: {
        name: string
        weight?: number
        isAI: boolean
    }) => {
        const criteriaArray = getValues('criteria')
        useAppDispatch(removeSelectedCriteria(item))
        setValue('criteria', deepCopy(insertAtArray(criteriaArray, 1, item)))
    }

    const infoClick = (name: string) => {
        useAppDispatch(
            setInfoCardSection({
                ...infoCardSection,
                criteriaClickedText:
                    infoCardSection.criteriaClickedText === name ? '' : name,
            })
        )
    }

    return (
        <AISidebar
            title={'AI Suggestions'}
            infoCircle
            className={
                isMobile
                    ? 'sticky -mx-1 top-11 pt-1 dark:bg-neutralDark-600 bg-neutral-25 z-50'
                    : ''
            }
        >
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
                            ? 'items-center space-x-5 '
                            : 'flex-col space-y-2'
                    } ${isMobile ? 'pb-2' : ''}`}
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
                                <div
                                    onClick={() => infoClick(item.name)}
                                    className={`group flex justify-center items-center p-2 ml-2 h-full custom-box-shadow dark:custom-box-shadow-dark
                                  ${
                                      infoCardSection.criteriaClickedText ===
                                      item.name
                                          ? 'bg-primary dark:bg-primaryDark'
                                          : 'hover:bg-primary hover:dark:bg-primaryDark'
                                  } rounded-lg border border-neutral-300 transition-all cursor-pointer`}
                                >
                                    <UilQuestionCircle
                                        className={`min-w-[20px] min-h-[20px] ${
                                            infoCardSection.criteriaClickedText ===
                                            item.name
                                                ? 'fill-white'
                                                : 'group-hover:fill-white fill-neutral-300'
                                        } `}
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </>
        </AISidebar>
    )
}
