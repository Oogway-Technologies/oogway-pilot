import { useUser } from '@auth0/nextjs-auth0'
import React, { Dispatch, FC, SetStateAction, useEffect } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useQueryClient } from 'react-query'

import {
    setClickedConnect,
    setDecisionActivityId,
    setDecisionEngineBestOption,
    setDecisionFormState,
    setDecisionQuestion,
    setIsDecisionRehydrated,
    setIsQuestionSafeForAI,
    setIsThereATie,
    setPreviousIndex,
    setSideCardStep,
    setUserIgnoredUnsafeWarning,
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
import { FirebaseUnauthenticatedDecision } from '../../../utils/types/firebase'
import { Criteria, Options } from '../../../utils/types/global'
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
        decisionEngineBestOption,
        decisionFormState,
        isThereATie,
    } = useAppSelector(state => state.decisionSlice)

    const createUnauthenticatedDecisions = usePutUnauthenticatedDecision()
    const queryClient = useQueryClient()
    const updateDecision = useCreateDecisionActivity()
    const { user } = useUser()

    // Determine best option from scores on mount.
    useEffect(() => {
        useAppDispatch(setDecisionEngineBestOption(calcBestOption()))
        if (getValues('question') && decisionActivityId) {
            useAppDispatch(
                updateDecisionFormState({ currentTab: 5, isComplete: true })
            )
            updateDecision.mutate({
                ...decisionFormState,
                id: decisionActivityId,
                isComplete: true,
                currentTab: 5,
            })
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

    // TODO: Turn into custom hook
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
        useAppDispatch(setIsDecisionRehydrated(false))
        useAppDispatch(setIsQuestionSafeForAI(true))
        useAppDispatch(setUserIgnoredUnsafeWarning(false))
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
        <div className="mb-3 flex flex-col space-y-3">
            <div className="my-4 flex flex-col space-y-1 text-center">
                {isThereATie ? (
                    <>
                        <span
                            className={`text-center font-bold leading-10 text-neutral-800 text-xl tracking-normal dark:text-white`}
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
                        <span className="text-center font-bold leading-10 text-primary text-3xl tracking-normal dark:text-primaryDark">
                            {decisionEngineBestOption}
                        </span>
                    </>
                )}
            </div>
            <ResultChart />
            <div className="mx-auto flex items-center space-x-4 py-4">
                <button
                    id={'manualDecision-NewDecision'}
                    onClick={handleReset}
                    className={feedToolbarClass.newPostButton}
                >
                    New Decision
                </button>
            </div>
            {isMobile ? <ScoreCard /> : ''}
            <BaseCard className="my-2 p-3 md:mx-1 md:p-5">
                <span
                    className={`${bodyHeavy} w-full text-neutral-700 dark:text-white`}
                >
                    Score Breakdown
                </span>
                <ResultTable />
            </BaseCard>
        </div>
    )
}
