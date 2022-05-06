// import { useUser } from '@auth0/nextjs-auth0'
import { UilArrowLeft, UilArrowRight } from '@iconscout/react-unicons'
import { FC, useEffect, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'

import {
    populateSuggestions,
    resetSuggestions,
    setDecisionRatingUpdate,
    setIsSuggestionsEmpty,
    setLoadingAiSuggestions,
    setRatingTabChecker,
    updateFormCopy,
} from '../../../features/decision/decisionSlice'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { squareButton } from '../../../styles/decision'
import { warningTime } from '../../../utils/constants/global'
import { deepCopy, fetcher, objectsEqual } from '../../../utils/helpers/common'
import { AISuggestions, Criteria, Options } from '../../../utils/types/global'
import { ProgressBar } from '../../Utils/common/ProgressBar'
import { DecisionSideBarOptions } from './DecisionSideBar'

interface DecisionBarHandlerProps {
    className?: string
    selectedTab: number
    setSelectedTab: (v: number) => void
}

export const DecisionBarHandler: FC<DecisionBarHandlerProps> = ({
    className,
    selectedTab,
    setSelectedTab,
}: DecisionBarHandlerProps) => {
    const {
        trigger,
        clearErrors,
        formState: { errors },
        getValues,
        control,
        resetField,
    } = useFormContext()
    // const { user } = useUser()
    const decisionRatingUpdate = useAppSelector(
        state => state.decisionSlice.decisionRatingUpdate
    )
    const isSuggestionsEmpty = useAppSelector(
        state => state.decisionSlice.isSuggestionsEmpty
    )
    const ratingTabChecker = useAppSelector(
        state => state.decisionSlice.ratingTabChecker
    )
    const [showError, setShowError] = useState(false)
    const formCopy = useAppSelector(state => state.decisionSlice.formCopy)
    const watchDecision = useWatch({ name: 'question', control })
    const watchOption = useWatch({ name: 'options', control })
    const watchCriteria = useWatch({ name: 'criteria', control })
    const [pointerArray, setPointerArray] = useState([
        false,
        false,
        false,
        false,
        false,
    ])

    const loadSuggestions = async () => {
        if (isSuggestionsEmpty) {
            useAppDispatch(setIsSuggestionsEmpty(false))
        }
        useAppDispatch(setLoadingAiSuggestions(true))
        const question = getValues('question').replaceAll(' ', '%20')
        const context = getValues('context').replaceAll(' ', '%20')
        const data: AISuggestions = await fetcher(
            `/api/getAISuggestions?question=${question}&context=${context}`
        )
        useAppDispatch(populateSuggestions(data))
        useAppDispatch(setLoadingAiSuggestions(false))
        if (
            !data.options.length &&
            !data.context_criteria.length &&
            !data.common_criteria.length
        ) {
            useAppDispatch(setIsSuggestionsEmpty(true))
        }
    }

    const validationHandler = async (tab: number) => {
        if (tab === 1) {
            await trigger(['question', 'context'])
            if (errors?.['question']?.message || errors?.['context']?.message) {
                setTimeout(
                    () => clearErrors(['question', 'context']),
                    warningTime
                )
                return false
            }
            if (
                formCopy.question !== getValues('question') ||
                formCopy.context !== getValues('context')
            ) {
                resetField('options')
                resetField('criteria')
                useAppDispatch(resetSuggestions())
                // if (user) {
                //     loadSuggestions()
                // }
                loadSuggestions()
                useAppDispatch(
                    updateFormCopy(
                        deepCopy({
                            ...formCopy,
                            question: getValues('question'),
                            context: getValues('context'),
                        })
                    )
                )
            }
        }
        if (tab === 2) {
            await trigger(['options'])
            if (errors?.options && errors?.options.length) {
                setTimeout(() => clearErrors(['options']), warningTime)
                return false
            }
            if (!objectsEqual(formCopy.options, getValues('options'))) {
                const optionFilter = getValues('options').filter(
                    (item: Options) => {
                        if (item.name) {
                            return item
                        }
                    }
                )
                const checkArray: boolean[] = new Array(optionFilter.length)
                    .fill(false)
                    .map(item => {
                        return item
                    })
                checkArray[0] = true
                useAppDispatch(setRatingTabChecker(checkArray))
                if (!decisionRatingUpdate) {
                    useAppDispatch(setDecisionRatingUpdate(true))
                }
                useAppDispatch(
                    updateFormCopy(
                        deepCopy({
                            ...formCopy,
                            options: [...getValues('options')],
                        })
                    )
                )
            }
        }
        if (tab === 3) {
            await trigger(['criteria'])
            if (errors?.criteria && errors?.criteria.length) {
                setTimeout(() => clearErrors(['criteria']), warningTime)
                return false
            }
            if (!objectsEqual(formCopy.criteria, getValues('criteria'))) {
                if (!decisionRatingUpdate) {
                    useAppDispatch(setDecisionRatingUpdate(true))
                }
                useAppDispatch(
                    updateFormCopy(
                        deepCopy({
                            ...formCopy,
                            criteria: [...getValues('criteria')],
                        })
                    )
                )
            }
        }
        if (tab === 4) {
            const checker = ratingTabChecker.every(v => v === true)
            if (!checker) {
                setShowError(true)
                setTimeout(() => {
                    setShowError(false)
                }, warningTime)
                return false
            }
        }
        return true
    }

    const handleForward = async () => {
        const isValid = await validationHandler(selectedTab)
        if (selectedTab !== DecisionSideBarOptions.length && isValid) {
            setSelectedTab(selectedTab + 1)
        }
    }

    const validateDecision = () => {
        const question: string = getValues('question')
        if (question) {
            return true
        }
        return false
    }

    const validateOption = () => {
        const options = getValues('options')
        let check = 0
        options.forEach((item: Options) => {
            if (item.name) {
                check = check + 1
            }
        })

        return check >= 2 ? true : false
    }

    const validateCriteria = () => {
        const criteria = getValues('criteria')
        let check = false
        criteria.forEach((item: Criteria) => {
            if (item.name) {
                check = true
            }
        })
        return check
    }

    useEffect(() => {
        if (validateDecision() && validateOption() && validateCriteria()) {
            setPointerArray([true, true, true, true, true])
        } else {
            setPointerArray([
                validateDecision(),
                validateOption(),
                validateCriteria(),
                false,
                false,
            ])
        }
    }, [watchDecision, watchOption, watchCriteria])

    return (
        <div
            className={`flex items-center justify-between relative ${
                className ? className : ''
            }`}
        >
            <button
                className={`${squareButton} mr-auto ${
                    selectedTab === 1
                        ? 'border-neutral-300 focus:border-neutral-300 active:border-neutral-300'
                        : 'border-primary focus:border-primary active:border-primary'
                }`}
                type="button"
                onClick={() => {
                    if (selectedTab !== 1) {
                        setSelectedTab(selectedTab - 1)
                    }
                }}
            >
                <UilArrowLeft className="fill-neutral-700  dark:fill-neutralDark-150" />
            </button>
            <div
                className={`w-3/6 ${
                    pointerArray[selectedTab - 1] ? 'ml-3' : ''
                }`}
            >
                {showError && (
                    <span className="absolute right-[3%] bottom-[100%] w-full text-center text-error">
                        The user should score each option.
                    </span>
                )}
                <ProgressBar
                    currentStep={selectedTab}
                    totalSteps={DecisionSideBarOptions.length}
                    className="w-full"
                />
            </div>
            <button
                className={`${squareButton} ml-auto ${
                    pointerArray[selectedTab - 1] &&
                    selectedTab !== 5 &&
                    selectedTab !== 4
                        ? 'border-primary focus:border-primary active:border-primary text-primary dark:text-primaryDark uppercase'
                        : pointerArray[selectedTab - 1] &&
                          selectedTab === 4 &&
                          ratingTabChecker.every(v => v === true)
                        ? 'border-primary focus:border-primary active:border-primary text-primary dark:text-primaryDark uppercase'
                        : 'border-neutral-300 focus:border-neutral-300 active:border-neutral-300'
                }`}
                type="button"
                disabled={selectedTab === 5}
                onClick={handleForward}
            >
                {pointerArray[selectedTab - 1] &&
                selectedTab !== 5 &&
                selectedTab !== 4 ? (
                    <span className="text-sm md:text-base">Continue</span>
                ) : pointerArray[selectedTab - 1] &&
                  selectedTab === 4 &&
                  ratingTabChecker.every(v => v === true) ? (
                    <span className="text-sm md:text-base">Continue</span>
                ) : null}
                <UilArrowRight
                    className={`${
                        pointerArray[selectedTab - 1] &&
                        selectedTab !== 5 &&
                        selectedTab !== 4
                            ? 'fill-primary dark:fill-primaryDark'
                            : pointerArray[selectedTab - 1] &&
                              selectedTab === 4 &&
                              ratingTabChecker.every(v => v === true)
                            ? 'fill-primary dark:fill-primaryDark'
                            : 'fill-neutral-700 dark:fill-neutralDark-150'
                    }`}
                />
            </button>
        </div>
    )
}
