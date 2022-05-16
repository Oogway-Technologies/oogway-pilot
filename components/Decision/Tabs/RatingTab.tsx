import React, { FC, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

import {
    setDecisionActivityId,
    setDecisionQuestion,
    setDecisionRatingUpdate,
    setPreviousIndex,
} from '../../../features/decision/decisionSlice'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { useCreateDecisionActivity } from '../../../queries/decisionActivity'
import { RatingSlider } from '../common/RatingSlider'

interface RatingTabProps {
    deviceIp: string
}

export const RatingTab: FC<RatingTabProps> = ({ deviceIp }) => {
    const optionIndex = useAppSelector(
        state => state.decisionSlice.decisionEngineOptionTab
    )
    const decisionRatingUpdate = useAppSelector(
        state => state.decisionSlice.decisionRatingUpdate
    )
    const { getValues, setValue } = useFormContext()
    const user = useAppSelector(state => state.userSlice.user)
    const prevQuestion = useAppSelector(
        state => state.decisionSlice.decisionQuestion
    )
    const createDecision = useCreateDecisionActivity()
    const question = getValues('question')

    useEffect(() => {
        if (decisionRatingUpdate) {
            const optionsList = getValues('options')
            const criteriaList = getValues('criteria')
            const mapRatingObject: any[] = []
            const reShapeCriteriaList: any[] = []

            criteriaList.forEach((item: { name: string; weight: number }) => {
                reShapeCriteriaList.push({
                    criteria: item.name,
                    value: 1,
                    weight: item.weight,
                })
            })
            optionsList.forEach((item: { name: string }) => {
                mapRatingObject.push({
                    option: item.name,
                    rating: reShapeCriteriaList,
                })
            })
            setValue('ratings', mapRatingObject)
            useAppDispatch(setDecisionRatingUpdate(false))
        }
        return () => {
            useAppDispatch(setPreviousIndex(4))

            // On dismount, check if new question matches previous question
            // If not, update state to new question and instantiate new
            // decision log
            if (question !== prevQuestion) {
                // Update previous question
                useAppDispatch(setDecisionQuestion(question))

                // Instantiate new decision
                const initialDecisionInfo = {
                    userId: user.uid,
                    ipAddress: deviceIp,
                    isComplete: false,
                }
                createDecision.mutate(initialDecisionInfo, {
                    onSuccess: newDecision => {
                        useAppDispatch(
                            setDecisionActivityId(newDecision.data.id)
                        )
                    },
                })
            }
        }
    }, [])

    return (
        <>
            {getValues('ratings')[optionIndex] &&
                getValues('ratings')[optionIndex]?.rating.map(
                    (
                        item: {
                            id: string
                            criteria: string
                        },
                        index: number
                    ) =>
                        item.criteria ? (
                            <React.Fragment
                                key={item.id + index + item.criteria}
                            >
                                <div className="flex flex-col mt-8 w-full">
                                    <RatingSlider
                                        id={item.id + index}
                                        registerName={
                                            `ratings.${optionIndex}.rating.${index}.value` as const
                                        }
                                        min={1}
                                        max={10}
                                        step={1}
                                        title={item.criteria}
                                    />
                                </div>
                            </React.Fragment>
                        ) : null
                )}
        </>
    )
}
