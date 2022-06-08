import React, { FC, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

import {
    setDecisionFormState,
    setDecisionRatingUpdate,
    setIsDecisionFormUpdating,
    setPreviousIndex,
} from '../../../features/decision/decisionSlice'
import useMediaQuery from '../../../hooks/useMediaQuery'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { useCreateDecisionActivity } from '../../../queries/decisionActivity'
import { deepCopy } from '../../../utils/helpers/common'
import { Criteria, Options, Rating, Ratings } from '../../../utils/types/global'
import { RatingSelector } from '../common/RatingSelector'

export const RatingTab: FC = () => {
    const { getValues, setValue } = useFormContext()
    const {
        decisionEngineOptionTab,
        decisionRatingUpdate,
        criteriaMobileIndex,
        decisionFormState,
        decisionActivityId,
        isDecisionFormUpdating,
    } = useAppSelector(state => state.decisionSlice)
    const updateDecision = useCreateDecisionActivity()

    const ratingsList: Ratings[] = getValues('ratings')
    const isMobile = useMediaQuery('(max-width: 965px)')

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
        // Log previous form state
        if (!isDecisionFormUpdating) updateDecision.mutate(decisionFormState)

        const orgOptionsList = getValues('options')
        const orgCriteriaList = getValues('criteria')
        const criteriaList = orgCriteriaList.filter(
            (item: Criteria) => item.name
        )
        const optionsList = orgOptionsList.filter((item: Options) => item.name)
        setValue('options', optionsList)
        setValue('criteria', criteriaList)

        if (decisionRatingUpdate) {
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
            console.log('Setting ratings array...')
            setValue('ratings', mapRatingObject)
            useAppDispatch(setDecisionRatingUpdate(false))

            // Track form state
            if (decisionActivityId) {
                useAppDispatch(
                    setDecisionFormState({
                        id: decisionActivityId,
                        ratings: mapRatingObject,
                        currentTab: 5,
                    })
                )
                useAppDispatch(setIsDecisionFormUpdating(false))
            }
        }

        return () => {
            useAppDispatch(setPreviousIndex(4))
        }
    }, [])

    return (
        <>
            {isMobile ? (
                <>
                    <div
                        className="flex flex-col p-1 mt-auto w-full"
                        key={`rating-tab-slider-${criteriaMobileIndex}`}
                    >
                        <RatingSelector
                            registerName={
                                `ratings.${decisionEngineOptionTab}.rating.${criteriaMobileIndex}.value` as const
                            }
                            title={
                                ratingsList[decisionEngineOptionTab].rating[
                                    criteriaMobileIndex
                                ].criteria
                            }
                        />
                    </div>
                </>
            ) : (
                ratingsList[decisionEngineOptionTab] &&
                ratingsList[decisionEngineOptionTab]?.rating.map(
                    (item: Rating, index: number) =>
                        item.criteria && (
                            <div
                                className="flex flex-col p-1 mt-8 w-full"
                                key={`rating-tab-slider-${index}`}
                            >
                                <RatingSelector
                                    registerName={
                                        `ratings.${decisionEngineOptionTab}.rating.${index}.value` as const
                                    }
                                    title={item.criteria}
                                />
                            </div>
                        )
                )
            )}
        </>
    )
}
