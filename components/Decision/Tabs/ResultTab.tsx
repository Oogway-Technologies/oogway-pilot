import { useUser } from '@auth0/nextjs-auth0'
import { UilArrowDownRight } from '@iconscout/react-unicons'
import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useQueryClient } from 'react-query'

import {
    setClickedConnect,
    setDecisionActivityId,
    setDecisionEngineBestOption,
    setDecisionFormState,
    setDecisionQuestion,
    setIsDecisionFormUpdating,
    setIsDecisionRehydrated,
    setIsRatingsModified,
    setIsThereATie,
    setPreviousIndex,
    setSideCardStep,
    updateDecisionFormState,
} from '../../../features/decision/decisionSlice'
import useMediaQuery from '../../../hooks/useMediaQuery'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { useCreateDecisionActivity } from '../../../queries/decisionActivity'
import {
    getUnauthenticatedDecisionPayload,
    usePutUnauthenticatedDecision,
} from '../../../queries/unauthenticatedDecisions'
import { feedToolbarClass } from '../../../styles/feed'
import { body, bodyHeavy } from '../../../styles/typography'
import {
    FirebaseDecisionActivity,
    FirebaseUnauthenticatedDecision,
} from '../../../utils/types/firebase'
import { Criteria, Options } from '../../../utils/types/global'
import { Collapse } from '../../Utils/common/Collapse'
import { BaseCard } from '../common/BaseCard'
import { ResultChart } from '../common/ResultChart'
import { ResultTable } from '../common/ResultTable'
import { ScoreCard } from '../SideCards/ScoreCard'

interface ResultTabProps {
    setCurrentTab: Dispatch<SetStateAction<number>>
    setMatrixStep: Dispatch<SetStateAction<number>>
    deviceIp: string
}

export const ResultTab: FC<ResultTabProps> = ({
    setCurrentTab,
    setMatrixStep,
    deviceIp,
}: ResultTabProps) => {
    const { control, setValue, reset, getValues } = useFormContext()
    const isMobile = useMediaQuery('(max-width: 965px)')
    const optionList: Options[] = useWatch({ name: 'options', control })

    const {
        decisionActivityId,
        suggestions: aiSuggestions,
        decisionEngineBestOption,
        isThereATie,
        decisionFormState,
    } = useAppSelector(state => state.decisionSlice)

    const [isOpen, setOpen] = useState(false)
    const createUnauthenticatedDecisions = usePutUnauthenticatedDecision()
    const queryClient = useQueryClient()
    const updateDecision = useCreateDecisionActivity()
    const { user } = useUser()

    // Determine best option from scores on mount.
    useEffect(() => {
        useAppDispatch(setDecisionEngineBestOption(calcBestOption()))
        if (getValues('question') && decisionActivityId) {
            saveResult(decisionActivityId)
        }

        return () => {
            useAppDispatch(setPreviousIndex(5))
        }
    }, [optionList, decisionActivityId])

    useEffect(() => {
        fixUpStates()
        optionList.forEach((_: Options, index: number) => {
            setValue(`options.${index}.score`, calcScore(index))
        })
    }, [])

    useEffect(() => {
        if (!user && decisionActivityId) {
            const data: getUnauthenticatedDecisionPayload | undefined =
                queryClient.getQueryData(['unauthenticatedDecisions', deviceIp])
            const unauthenticatedDecision = data?.results
            const payload: FirebaseUnauthenticatedDecision =
                unauthenticatedDecision
                    ? {
                          decisions: [
                              ...unauthenticatedDecision.decisions,
                              decisionActivityId,
                          ],
                      }
                    : {
                          decisions: [decisionActivityId],
                      }
            createUnauthenticatedDecisions.mutate({
                _ipAddress: deviceIp,
                unauthenticatedDecision: payload,
            })
        }
    }, [user, decisionActivityId])

    const fixUpStates = () => {
        const orgOptionsList = getValues('options')
        const orgCriteriaList = getValues('criteria')

        const criteriaList = orgCriteriaList.filter(
            (item: Criteria) => item.name
        )
        const optionsList = orgOptionsList.filter((item: Options) => item.name)
        setValue('options', optionsList)
        setValue('criteria', criteriaList)
    }

    const saveResult = (id: string) => {
        // Update decision form state
        useAppDispatch(
            updateDecisionFormState({ currentTab: 5, isComplete: true })
        )
        // Result object for firebase.
        const result: FirebaseDecisionActivity = {
            id: id,
            ratings: getValues('ratings'),
            suggestedOptions: aiSuggestions.copyOptionsList,
            suggestedCriteria: aiSuggestions.copyCriteriaList,
            isComplete: true,
            currentTab: 5,
        }
        updateDecision.mutate({ ...decisionFormState, ...result })
    }

    const calcBestOption = () => {
        let currentBestScore = 0
        let currentBestOptions: string[] = []
        for (const option of optionList) {
            if (option.score && option.score > currentBestScore) {
                // If there's only one or zero current best option(s),
                // replace with new best
                if (currentBestOptions.length < 2) {
                    currentBestOptions[0] = option.name
                } else {
                    // If there's a current tie, but current option
                    // dominates both, replace the array
                    currentBestOptions = [option.name]
                }

                // Update new new best score
                currentBestScore = option.score
            }

            // If there's a tie, push to stack
            if (option.score === currentBestScore) {
                currentBestOptions.push(option.name)
            }
        }

        // In case of ties, randomly choose best option
        if ([...new Set(currentBestOptions)].length > 1) {
            useAppDispatch(setIsThereATie(true))
            return currentBestOptions[
                (Math.random() * currentBestOptions.length) | 0
            ]
        } else {
            useAppDispatch(setIsThereATie(false))
            return currentBestOptions[0]
        }
    }
    const handleReset = () => {
        // reset form state
        reset()
        // Return to first tab
        setCurrentTab(0)
        // Wipe previous decision question and id
        useAppDispatch(setDecisionQuestion(undefined))
        useAppDispatch(setDecisionActivityId(undefined))
        useAppDispatch(setSideCardStep(1))
        useAppDispatch(setClickedConnect(false))
        useAppDispatch(setDecisionFormState({}))
        useAppDispatch(setIsDecisionFormUpdating(false))
        useAppDispatch(setIsRatingsModified(false))
        useAppDispatch(setIsDecisionRehydrated(false))
        setMatrixStep(0)
    }
    const calcScore = (index: number): number => {
        let sumWeights = 0
        let sumWeightedScore = 0
        // Calculate denominator
        const criteriaList = getValues('criteria')
        for (const criteria of criteriaList) {
            sumWeights += criteria.weight
        }

        const ratingList = getValues(`ratings.${index}.rating`)
        // Calculate numerator
        if (ratingList) {
            for (const rating of ratingList) {
                sumWeightedScore += rating.value * rating.weight
            }
        }
        return parseFloat((sumWeightedScore / sumWeights).toFixed(1))
    }

    return (
        <div className="flex flex-col mb-3 space-y-3">
            <div className="flex flex-col my-4 space-y-1 text-center">
                {isThereATie ? (
                    <>
                        <span
                            className={`text-xl font-bold tracking-normal leading-10 text-center text-neutral-800 dark:text-white`}
                        >
                            It’s a tie so we picked one for you.
                        </span>
                        <span
                            className={`${body} text-neutral-700 dark:text-neutralDark-150`}
                        >
                            Your best option is{' '}
                            <b className="text-primary dark:text-primaryDark">
                                {decisionEngineBestOption}
                            </b>
                            .
                        </span>
                        <span
                            className={`${body} text-neutral-700 dark:text-neutralDark-150`}
                        >
                            Refine{' '}
                            <b className="text-primary dark:text-primaryDark">
                                rating
                            </b>{' '}
                            for criteria to get a more accurate result.
                        </span>
                    </>
                ) : (
                    <>
                        <span
                            className={`${body} text-neutral-700 dark:text-neutralDark-150`}
                        >
                            Your best option is
                        </span>
                        <span className="text-3xl font-bold tracking-normal leading-10 text-center text-primary dark:text-primaryDark">
                            {decisionEngineBestOption}
                        </span>
                    </>
                )}
            </div>
            <ResultChart />
            <div className="flex items-center py-4 mx-auto space-x-4">
                <button
                    onClick={handleReset}
                    className={feedToolbarClass.newPostButton}
                >
                    New Decision
                </button>
                {/* <button
                    className={feedToolbarClass.newPostButton}
                    onClick={() => console.log(getValues())}
                >
                    Get Feedback
                </button> */}
            </div>
            {isMobile ? <ScoreCard /> : ''}
            <BaseCard className="p-3  my-2 md:p-5 md:mx-1">
                <div
                    onClick={() => setOpen(!isOpen)}
                    className={'flex items-center cursor-pointer'}
                >
                    <span
                        className={`${bodyHeavy} text-neutral-700 dark:text-white w-full`}
                    >
                        Score Breakdown
                    </span>
                    <UilArrowDownRight
                        className={`fill-neutral-700 dark:fill-neutral-150 transition-all ${
                            isOpen ? 'rotate-180' : 'rotate-0'
                        }`}
                    />
                </div>
                <Collapse show={isOpen} className={'overflow-y-scroll'}>
                    <ResultTable />
                </Collapse>
            </BaseCard>
        </div>
    )
}
