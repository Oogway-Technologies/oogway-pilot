import { useUser } from '@auth0/nextjs-auth0'
import { UilArrowLeft, UilArrowRight } from '@iconscout/react-unicons'
import { FC, useEffect, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'

import {
    populateSuggestions,
    resetSuggestions,
    setCriteriaMobileIndex,
    setDecisionCriteriaQueryKey,
    setDecisionEngineOptionTab,
    setDecisionRatingUpdate,
    setIsSuggestionsEmpty,
    setIsThereATie,
    setLoadingAiSuggestions,
    updateFormCopy,
} from '../../../features/decision/decisionSlice'
import useMediaQuery from '../../../hooks/useMediaQuery'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { squareButton } from '../../../styles/decision'
import {
    decisionSideBarOptions,
    warningTime,
} from '../../../utils/constants/global'
import { deepCopy, fetcher, objectsEqual } from '../../../utils/helpers/common'
import { AISuggestions, Criteria, Options } from '../../../utils/types/global'

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
    const { user } = useUser()
    const {
        decisionRatingUpdate,
        isSuggestionsEmpty,
        decisionEngineOptionTab,
        criteriaMobileIndex,
        userExceedsMaxDecisions,
    } = useAppSelector(state => state.decisionSlice)

    const isMobile = useMediaQuery('(max-width: 965px)')
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
                if (!userExceedsMaxDecisions || user) {
                    loadSuggestions()
                }
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
            console.log(errors)
            if (errors?.options && errors?.options.length) {
                setTimeout(() => clearErrors(['options']), warningTime)
                return false
            }
            if (!objectsEqual(formCopy.options, getValues('options'))) {
                useAppDispatch(setIsThereATie(false))
                useAppDispatch(setDecisionEngineOptionTab(0))
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
                useAppDispatch(setIsThereATie(false))
                useAppDispatch(setDecisionEngineOptionTab(0))
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
            const optionFilter = getValues('options').filter(
                (item: Options) => {
                    if (item.name) {
                        return item
                    }
                }
            )

            if (isMobile) {
                const criteriaFilter = getValues('criteria').filter(
                    (item: Criteria) => {
                        if (item.name) {
                            return item
                        }
                    }
                )
                if (criteriaMobileIndex < criteriaFilter.length - 1) {
                    useAppDispatch(
                        setCriteriaMobileIndex(criteriaMobileIndex + 1)
                    )
                    useAppDispatch(setDecisionCriteriaQueryKey(undefined))
                    return false
                } else {
                    if (decisionEngineOptionTab < optionFilter.length - 1) {
                        useAppDispatch(setCriteriaMobileIndex(0))
                        useAppDispatch(
                            setDecisionEngineOptionTab(
                                decisionEngineOptionTab + 1
                            )
                        )
                        useAppDispatch(setDecisionCriteriaQueryKey(undefined))
                        return false
                    }
                }
            }

            if (!isMobile) {
                if (decisionEngineOptionTab < optionFilter.length - 1) {
                    useAppDispatch(
                        setDecisionEngineOptionTab(decisionEngineOptionTab + 1)
                    )
                    useAppDispatch(setDecisionCriteriaQueryKey(undefined))
                    return false
                }
            }
        }
        return true
    }

    const handleForward = async () => {
        const isValid = await validationHandler(selectedTab)
        if (selectedTab !== decisionSideBarOptions.length && isValid) {
            setSelectedTab(selectedTab + 1)
        }
        useAppDispatch(setDecisionCriteriaQueryKey(undefined))
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

    const handleBackwards = () => {
        // for mobile
        if (isMobile && selectedTab === 4) {
            if (criteriaMobileIndex !== 0) {
                useAppDispatch(setCriteriaMobileIndex(criteriaMobileIndex - 1))
            } else {
                const criteriaFilter = getValues('criteria').filter(
                    (item: Criteria) => {
                        if (item.name) {
                            return item
                        }
                    }
                )
                if (decisionEngineOptionTab !== 0) {
                    useAppDispatch(
                        setDecisionEngineOptionTab(decisionEngineOptionTab - 1)
                    )
                    useAppDispatch(
                        setCriteriaMobileIndex(criteriaFilter.length - 1)
                    )
                } else {
                    setSelectedTab(selectedTab - 1)
                    useAppDispatch(setCriteriaMobileIndex(0))
                }
            }
        } else {
            if (isMobile && selectedTab !== 1) {
                setSelectedTab(selectedTab - 1)
            }
        }

        // for desktop
        if (!isMobile) {
            if (selectedTab === 4 && decisionEngineOptionTab !== 0) {
                useAppDispatch(
                    setDecisionEngineOptionTab(decisionEngineOptionTab - 1)
                )
            } else if (selectedTab !== 1) {
                setSelectedTab(selectedTab - 1)
            }
        }
        useAppDispatch(setDecisionCriteriaQueryKey(undefined))
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
            {selectedTab !== 1 ? (
                <button
                    className={`${squareButton} ml-auto ${
                        selectedTab === 1
                            ? 'border-neutral-300 focus:border-neutral-300 active:border-neutral-300'
                            : 'border-primary focus:border-primary active:border-primary'
                    }`}
                    type="button"
                    onClick={handleBackwards}
                >
                    <UilArrowLeft className="fill-neutral-700  dark:fill-neutralDark-150" />
                </button>
            ) : (
                <div className="ml-auto" />
            )}
            {selectedTab !== 5 && (
                <button
                    className={`${squareButton} ml-3 ${
                        pointerArray[selectedTab - 1] && selectedTab !== 5
                            ? 'border-primary focus:border-primary active:border-primary text-primary dark:text-primaryDark uppercase'
                            : 'border-neutral-300 focus:border-neutral-300 active:border-neutral-300'
                    }`}
                    type="button"
                    disabled={selectedTab === 5}
                    onClick={handleForward}
                >
                    {pointerArray[selectedTab - 1] && selectedTab !== 5 ? (
                        <span className="text-sm md:text-base">Continue</span>
                    ) : null}
                    <UilArrowRight
                        className={`${
                            pointerArray[selectedTab - 1] && selectedTab !== 5
                                ? 'fill-primary dark:fill-primaryDark'
                                : 'fill-neutral-700 dark:fill-neutralDark-150'
                        }`}
                    />
                </button>
            )}
        </div>
    )
}
