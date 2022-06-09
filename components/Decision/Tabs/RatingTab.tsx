import React, { FC, useEffect, useRef } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'

import {
    setDecisionRatingUpdate,
    setIsDecisionFormUpdating,
    setPreviousIndex,
    updateDecisionFormState,
} from '../../../features/decision/decisionSlice'
import useMediaQuery from '../../../hooks/useMediaQuery'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { deepCopy } from '../../../utils/helpers/common'
import { FirebaseDecisionActivity } from '../../../utils/types/firebase'
import { Criteria, Options, Rating, Ratings } from '../../../utils/types/global'
import { RatingSelector } from '../common/RatingSelector'

export const RatingTab: FC = () => {
    const { getValues, setValue, control } = useFormContext()
    const {
        decisionEngineOptionTab,
        decisionRatingUpdate,
        criteriaMobileIndex,
        isRatingsModified,
    } = useAppSelector(state => state.decisionSlice)

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

    const isRatingsModifiedRef = useRef(isRatingsModified)
    useEffect(() => {
        isRatingsModifiedRef.current = isRatingsModified
    }, [isRatingsModified])

    useEffect(() => {
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
            setValue('ratings', mapRatingObject)
            useAppDispatch(setDecisionRatingUpdate(false))
        }

        return () => {
            useAppDispatch(setPreviousIndex(4))
        }
    }, [])

    const ratingsArray = useWatch({ name: 'ratings', control })
    useEffect(() => {
        // Track form state
        let formState: FirebaseDecisionActivity = {
            currentTab: 4,
        }
        if (ratingsArray.length && ratingsArray[0].option !== '') {
            formState = {
                ...formState,
                ratings: deepCopy(ratingsArray),
            }
        }

        useAppDispatch(updateDecisionFormState(formState))
        useAppDispatch(setIsDecisionFormUpdating(false))
    }, [ratingsArray])

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
