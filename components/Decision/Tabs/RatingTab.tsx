import React, { FC, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

import {
    setDecisionRatingUpdate,
    setPreviousIndex,
} from '../../../features/decision/decisionSlice'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { deepCopy } from '../../../utils/helpers/common'
import { Rating, Ratings } from '../../../utils/types/global'
import { RatingSlider } from '../common/RatingSlider'

export const RatingTab: FC = () => {
    const optionIndex = useAppSelector(
        state => state.decisionSlice.decisionEngineOptionTab
    )
    const decisionRatingUpdate = useAppSelector(
        state => state.decisionSlice.decisionRatingUpdate
    )
    const { getValues, setValue } = useFormContext()

    const findInOption = (
        array: Ratings[],
        name: string
    ): (Ratings & { index: number }) | undefined => {
        let found = undefined
        array.forEach((item, idx) => {
            if (item.option === name) {
                found = { ...item, index: idx }
            }
        })
        return found
    }
    const findInCriteria = (
        array: Rating[],
        name: string
    ): (Rating & { index: number }) | undefined => {
        let found = undefined
        array.forEach((item, idx) => {
            if (item.criteria === name) {
                found = { ...item, index: idx }
            }
        })
        return found
    }

    useEffect(() => {
        if (decisionRatingUpdate) {
            const optionsList = getValues('options')
            const criteriaList = getValues('criteria')
            const mapRatingObject: Ratings[] = []
            const reShapeCriteriaList: Rating[] = []

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
            const existingRating: Ratings[] = getValues('ratings')
            if (existingRating.length) {
                mapRatingObject.forEach((item, indx) => {
                    const isFound = findInOption(existingRating, item.option)
                    if (isFound) {
                        const newRating: Rating[] = []
                        item.rating.forEach((ctr, idx) => {
                            const isFoundCriteria = findInCriteria(
                                existingRating[isFound.index].rating,
                                ctr.criteria
                            )
                            if (isFoundCriteria) {
                                newRating.push(
                                    deepCopy({
                                        criteria:
                                            mapRatingObject[indx].rating[idx]
                                                .criteria,
                                        value: isFoundCriteria.value,
                                        weight: mapRatingObject[indx].rating[
                                            idx
                                        ].weight,
                                    })
                                )
                            } else {
                                newRating.push(ctr)
                            }
                        })
                        mapRatingObject[indx].rating = [...newRating]
                    }
                })
            }
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
