import React, { FC, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

import {
    setDecisionRatingUpdate,
    setPreviousIndex,
} from '../../../features/decision/decisionSlice'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { RatingSelector } from '../common/RatingSelector'

export const RatingTab: FC = () => {
    const optionIndex = useAppSelector(
        state => state.decisionSlice.decisionEngineOptionTab
    )
    const decisionRatingUpdate = useAppSelector(
        state => state.decisionSlice.decisionRatingUpdate
    )
    const { getValues, setValue } = useFormContext()

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
                            <div
                                className="flex flex-col mt-8 w-full"
                                key={`rating-tab-slider-${index}`}
                            >
                                <RatingSelector
                                    registerName={
                                        `ratings.${optionIndex}.rating.${index}.value` as const
                                    }
                                    title={item.criteria}
                                />
                            </div>
                        ) : null
                )}
        </>
    )
}
