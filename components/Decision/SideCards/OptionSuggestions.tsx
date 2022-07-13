import { UilQuestionCircle } from '@iconscout/react-unicons'
import { UilSpinner } from '@iconscout/react-unicons'
import React from 'react'
import { useFormContext } from 'react-hook-form'

import {
    removeSelectedOption,
    setInfoCardSection,
} from '../../../features/decision/decisionSlice'
import useMediaQuery from '../../../hooks/useMediaQuery'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { body, bodyHeavy } from '../../../styles/typography'
import { deepCopy, insertAtArray } from '../../../utils/helpers/common'
import AISidebar from '../common/AISidebar'
import { SuggestionItem } from '../common/SuggestionItem'

export const OptionSuggestions = () => {
    const {
        loadingAiSuggestions,
        isSuggestionsEmpty,
        suggestions: { optionsList },
        infoCardSection,
    } = useAppSelector(state => state.decisionSlice)
    const { getValues, setValue } = useFormContext()
    const isMobile = useMediaQuery('(max-width: 965px)')

    const handleItemAdd = (item: {
        name: string
        weight?: number
        isAI: boolean
    }) => {
        const optionArray = getValues('options')
        if (optionArray.length < 6) {
            useAppDispatch(removeSelectedOption(item))
            setValue('options', deepCopy(insertAtArray(optionArray, 1, item)))
        }
    }

    const infoClick = (name: string) => {
        useAppDispatch(
            setInfoCardSection({
                ...infoCardSection,
                optionClickedText:
                    infoCardSection.optionClickedText === name ? '' : name,
            })
        )
    }

    return (
        <AISidebar
            title={'AI Suggestions'}
            infoCircle
            className={
                isMobile
                    ? 'sticky top-11 z-50 -mx-1 bg-neutral-25 pt-1 dark:bg-neutralDark-600'
                    : ''
            }
        >
            <>
                {optionsList.length && !loadingAiSuggestions
                    ? !isMobile && (
                          <span
                              className={`${body} text-neutral-700 dark:text-neutralDark-150`}
                          >
                              Click on suggestion to auto-fill
                          </span>
                      )
                    : null}
                <div
                    className={`flex max-h-[320px] w-full overflow-auto ${
                        isMobile && optionsList.length && !loadingAiSuggestions
                            ? 'items-center space-x-5'
                            : 'flex-col space-y-2'
                    } ${isMobile ? 'pb-2' : ''}`}
                >
                    {loadingAiSuggestions && (
                        <UilSpinner className={'my-3 mx-auto animate-spin'} />
                    )}
                    {!optionsList.length && !loadingAiSuggestions && (
                        <span className="mt-4 text-center font-normal text-neutral-700 text-sm dark:text-neutralDark-150">
                            No more suggestions.
                        </span>
                    )}
                    {isSuggestionsEmpty && (
                        <>
                            <span
                                className={`${bodyHeavy} mx-auto mt-4 text-center`}
                            >
                                Oogway AI cannot help with this decision.
                            </span>
                            <span className="mt-4 text-center font-normal text-neutral-700 text-sm dark:text-neutralDark-150">
                                {`It’s a work in progress and it’s learning to serve better suggestions with each decision you make.`}
                            </span>
                        </>
                    )}
                    {optionsList.map((item, index) => {
                        return (
                            <div
                                key={`option-list-item-${index}`}
                                className={'mt-4 flex w-full items-center'}
                            >
                                <SuggestionItem
                                    suggestionItem={item}
                                    onClick={handleItemAdd}
                                />
                                <div
                                    onClick={() => infoClick(item.name)}
                                    className={`group custom-box-shadow dark:custom-box-shadow-dark ml-2 flex h-full items-center justify-center p-2
                                  ${
                                      infoCardSection.optionClickedText ===
                                      item.name
                                          ? 'bg-primary dark:bg-primaryDark'
                                          : 'hover:bg-primary hover:dark:bg-primaryDark'
                                  } cursor-pointer rounded-lg border border-neutral-300 transition-all`}
                                >
                                    <UilQuestionCircle
                                        className={`min-h-[20px] min-w-[20px] ${
                                            infoCardSection.optionClickedText ===
                                            item.name
                                                ? 'fill-white'
                                                : 'fill-neutral-300 group-hover:fill-white'
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
