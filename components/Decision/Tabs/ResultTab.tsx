import { useUser } from '@auth0/nextjs-auth0'
import React, { FC, useEffect } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useQueryClient } from 'react-query'

import {
    setDecisionActivityId,
    setDecisionEngineBestOption,
    setDecisionQuestion,
    setPreviousIndex,
    setSideCardStep,
} from '../../../features/decision/decisionSlice'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { useCreateDecisionActivity } from '../../../queries/decisionActivity'
import {
    getUnauthenticatedDecisionPayload,
    usePutUnauthenticatedDecision,
} from '../../../queries/unauthenticatedDecisions'
import { feedToolbarClass } from '../../../styles/feed'
import { bodyHeavy } from '../../../styles/typography'
import {
    decisionOption,
    FirebaseDecisionActivity,
    FirebaseUnauthenticatedDecision,
} from '../../../utils/types/firebase'
import { ResultCard } from '../common/ResultCard'

interface ResultTabProps {
    setCurrentTab: React.Dispatch<React.SetStateAction<number>>
    deviceIp: string
}

export const ResultTab: FC<ResultTabProps> = ({
    setCurrentTab,
    deviceIp,
}: ResultTabProps) => {
    const { control, setValue, reset, getValues } = useFormContext()
    const { decisionActivityId, decisionFormState } = useAppSelector(
        state => state.decisionSlice
    )
    const aiSuggestions = useAppSelector(
        state => state.decisionSlice.suggestions
    )
    const options: Array<decisionOption> = useWatch({
        control,
        name: 'options',
    })
    const updateDecision = useCreateDecisionActivity()
    const createUnauthenticatedDecisions = usePutUnauthenticatedDecision()
    const queryClient = useQueryClient()

    // On mouont, log form state from previous tab
    useEffect(() => {
        updateDecision.mutate(decisionFormState)
    }, [])

    // Determine best option from scores on mount.
    useEffect(() => {
        useAppDispatch(setDecisionEngineBestOption(calcBestOption()))
        if (getValues('question') && decisionActivityId) {
            saveResult(decisionActivityId)
        }
        return () => {
            useAppDispatch(setPreviousIndex(5))
        }
    }, [options, decisionActivityId])

    // Update unauthenticatedDecisions
    const { user } = useUser()
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

    const saveResult = (id: string) => {
        // Result object for firebase.
        const result: FirebaseDecisionActivity = {
            id: id,
            suggestedOptions: aiSuggestions.copyOptionsList,
            suggestedCriteria: aiSuggestions.copyCriteriaList,
            isComplete: true,
            currentTab: 5,
        }
        console.log(
            `Updating decision ${decisionActivityId} with data: `,
            result
        )
        // saving result to firebase.
        updateDecision.mutate(result)
    }

    const calcBestOption = () => {
        let currentBestScore = 0
        let currentBestOptions: string[] = []
        for (const option of options) {
            if (option.score > currentBestScore) {
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
        if (currentBestOptions.length > 1) {
            return currentBestOptions[
                (Math.random() * currentBestOptions.length) | 0
            ]
        } else {
            return currentBestOptions[0]
        }
    }

    // Handler functions
    const handleReset = () => {
        // reset form state
        reset()
        // queryClient.invalidateQueries(
        //     ['decisionActivity', userProfile.uid, false],
        //     {
        //         refetchActive: false,
        //         refetchInactive: false,
        //     }
        // )
        // Return to first tab
        setCurrentTab(1)
        // Wipe previous decision question and id
        useAppDispatch(setDecisionQuestion(undefined))
        useAppDispatch(setDecisionActivityId(undefined))
        useAppDispatch(setSideCardStep(1))
    }

    return (
        <>
            <span
                className={`${bodyHeavy} text-neutral-700 mt-5 flex justify-start items-center mr-auto dark:text-neutralDark-150`}
            >
                Scores
            </span>
            <div className="flex flex-wrap gap-3 justify-center items-center">
                {options.map((option, index) =>
                    option.name ? (
                        <ResultCard
                            key={index}
                            optionIndex={index}
                            option={option}
                            criteriaArray={getValues('criteria')}
                            ratingsArray={getValues(`ratings.${index}.rating`)}
                            setValue={setValue}
                        />
                    ) : null
                )}
            </div>
            <div className="flex items-center pt-5 mx-auto space-x-6">
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
        </>
    )
}
