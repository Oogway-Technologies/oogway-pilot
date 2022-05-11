import React, { FC, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

import {
    setDecisionRatingUpdate,
    setPreviousIndex,
} from '../../../features/decision/decisionSlice'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { deepCopy } from '../../../utils/helpers/common'
import { RatingSlider } from '../common/RatingSlider'

export interface Rating {
    criteria: string
    value: number
    weight: number
}

export interface Ratings {
    option: string
    rating: Rating[]
}

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
            console.log(existingRating, mapRatingObject)

            if (existingRating.length) {
                mapRatingObject.forEach((item, indx) => {
                    const isFound = findInOption(existingRating, item.option)
                    if (isFound) {
                        console.log('old---found ->', isFound)
                        console.log('new---found ->', item.option)
                        item.rating.forEach((ctr, idx) => {
                            const isFoundCriteria = findInCriteria(
                                existingRating[isFound.index].rating,
                                ctr.criteria
                            )
                            if (isFoundCriteria) {
                                console.log('old---', isFoundCriteria)
                                console.log(
                                    'new---',
                                    mapRatingObject[indx].rating[idx]
                                )

                                mapRatingObject[indx].rating[idx] = deepCopy({
                                    criteria:
                                        mapRatingObject[indx].rating[idx]
                                            .criteria,
                                    value: isFoundCriteria.value,
                                    weight: mapRatingObject[indx].rating[idx]
                                        .weight,
                                })

                                console.log(
                                    'my new data== ',
                                    mapRatingObject[indx].rating[idx]
                                )
                            }
                        })
                    }
                })
                console.log(existingRating, mapRatingObject)

                // const outerIndex =
                //     existingRating.length >= mapRatingObject.length
                //         ? existingRating.length
                //         : mapRatingObject.length
                // const innerIndex =
                //     existingRating[0].rating.length >=
                //     mapRatingObject[0].rating.length
                //         ? existingRating[0].rating.length
                //         : mapRatingObject[0].rating.length

                // console.log(outerIndex, innerIndex)

                // for (let i = 0; i < outerIndex; i++) {
                //     if (
                //         existingRating[i] &&
                //         mapRatingObject[i] &&
                //         existingRating[i].option === mapRatingObject[i].option
                //     ) {
                //         for (let j = 0; j < innerIndex; j++) {
                //             if (
                //                 existingRating[i].rating[j] &&
                //                 mapRatingObject[i].rating[j] &&
                //                 existingRating[i].rating[j].criteria ===
                //                     mapRatingObject[i].rating[j].criteria
                //             ) {
                //                 mapRatingObject[i].rating[j] = deepCopy(
                //                     existingRating[i].rating[j]
                //                 )
                //             }
                //         }
                //     }
                // }
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
