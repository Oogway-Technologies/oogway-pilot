import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import {
    setClickedConnect,
    setDecisionActivityId,
    setDecisionFormState,
    setDecisionQuestion,
    setDecisionRatingUpdate,
    setIsDecisionFormUpdating,
    setIsDecisionRehydrated,
    setIsRatingsModified,
    setSideCardStep,
    updateDecisionFormState,
} from '../features/decision/decisionSlice'
import { useInfiniteDecisionsQuery } from '../queries/decisionActivity'
import { deepCopy } from '../utils/helpers/common'
import { FirebaseDecisionActivity } from '../utils/types/firebase'
import { DecisionForm } from '../utils/types/global'
import { useAppDispatch, useAppSelector } from './useRedux'

interface UseInstantiateDecisionFormProps {
    currentTab: number
    setCurrentTab: React.Dispatch<React.SetStateAction<number>>
}

const useInstantiateDecisionForm = ({
    currentTab,
    setCurrentTab,
}: UseInstantiateDecisionFormProps) => {
    const userProfile = useAppSelector(state => state.userSlice.user)

    // Rehydrate form state from stored values
    const methods = useForm<DecisionForm>({
        defaultValues: {
            question: '',
            context: '',
            options: [{ name: '', isAI: false }],
            criteria: [{ name: '', weight: 2, isAI: false }],
            ratings: [
                {
                    option: '',
                    score: '',
                    rating: [{ criteria: '', value: 0, weight: 1 }],
                },
            ],
        },
    })
    const { setValue } = methods
    const { isFetched, isSuccess } = useInfiniteDecisionsQuery(
        userProfile.uid,
        undefined,
        userProfile.uid !== '', // only enable the call if the userProfile.uid is defined
        retrievedData => {
            if (!retrievedData.pages[0].decisions[0].isComplete) {
                // Set rehydration flags
                useAppDispatch(setIsDecisionFormUpdating(true))
                useAppDispatch(setIsDecisionRehydrated(true))

                // Create copies
                const incompleteDecision = deepCopy(
                    retrievedData.pages[0].decisions[0]
                )
                // remove extra fields
                const extraFields = [
                    'timestamp',
                    'currentTab',
                    'id',
                    'userId',
                    'isComplete',
                    'ipAddress',
                ]
                for (const field of extraFields) {
                    delete incompleteDecision[field]
                }

                // set values
                const formState: FirebaseDecisionActivity = {
                    id: retrievedData.pages[0].decisions[0].id,
                }
                for (const [key, value] of Object.entries(
                    incompleteDecision as FirebaseDecisionActivity
                )) {
                    if (key !== 'clickedConnect') {
                        setValue(key, deepCopy(value), {
                            shouldValidate: true,
                            shouldDirty: true,
                        })
                    }
                    formState[key] = deepCopy(value)
                }
                // Set form state in redux
                useAppDispatch(
                    setDecisionActivityId(
                        retrievedData.pages[0].decisions[0].id
                    )
                )
                useAppDispatch(setDecisionQuestion(incompleteDecision.question))
                useAppDispatch(
                    setClickedConnect(incompleteDecision.clickedConnect)
                )
                if (incompleteDecision.clickedConnect)
                    useAppDispatch(setSideCardStep(2))
                useAppDispatch(updateDecisionFormState(formState))

                // update current tab
                if (retrievedData.pages[0].decisions[0].currentTab) {
                    setCurrentTab(
                        retrievedData.pages[0].decisions[0].currentTab
                    )
                    if (currentTab === 4)
                        useAppDispatch(setDecisionRatingUpdate(true))
                }
            }
        }
    )

    // Update ratings when user navigates back to decision engine tab
    // and form is rehydrated
    useEffect(() => {
        if (isFetched && isSuccess)
            useAppDispatch(setDecisionRatingUpdate(true))
    }, [])

    // Clear redux state on unmount
    useEffect(() => {
        return () => {
            // Wipe previous decision question and id
            useAppDispatch(setDecisionQuestion(undefined))
            useAppDispatch(setDecisionActivityId(undefined))
            useAppDispatch(setSideCardStep(1))
            useAppDispatch(setClickedConnect(false))
            useAppDispatch(setDecisionFormState({}))
            useAppDispatch(setIsDecisionFormUpdating(false))
            useAppDispatch(setIsRatingsModified(false))
            useAppDispatch(setIsDecisionRehydrated(false))
        }
    }, [])

    // Return form methods
    return methods
}

export default useInstantiateDecisionForm
