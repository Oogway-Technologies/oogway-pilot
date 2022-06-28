import React, { FC, useEffect, useRef } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'

import {
    setIsDecisionFormUpdating,
    setPreviousIndex,
    updateDecisionFormState,
} from '../../../features/decision/decisionSlice'
import useMediaQuery from '../../../hooks/useMediaQuery'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { deepCopy } from '../../../utils/helpers/common'
import { FirebaseDecisionActivity } from '../../../utils/types/firebase'
import { Rating } from '../../../utils/types/global'
import { RatingSelector } from '../common/RatingSelector'

export const RatingTab: FC = () => {
    const { control } = useFormContext()
    const { decisionEngineOptionTab, criteriaMobileIndex, isRatingsModified } =
        useAppSelector(state => state.decisionSlice)

    const ratingsArray = useWatch({ name: 'ratings', control })

    const isMobile = useMediaQuery('(max-width: 965px)')

    const isRatingsModifiedRef = useRef(isRatingsModified)
    useEffect(() => {
        isRatingsModifiedRef.current = isRatingsModified
    }, [isRatingsModified])

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

        return () => {
            useAppDispatch(setPreviousIndex(4))
        }
    }, [ratingsArray])

    return (
        <>
            {isMobile ? (
                <>
                    <div
                        className="mt-auto flex w-full flex-col p-1"
                        key={`rating-tab-slider-${criteriaMobileIndex}`}
                    >
                        <RatingSelector
                            registerName={
                                `ratings.${decisionEngineOptionTab}.rating.${criteriaMobileIndex}.value` as const
                            }
                            title={
                                ratingsArray[decisionEngineOptionTab].rating[
                                    criteriaMobileIndex
                                ].criteria
                            }
                            value={
                                ratingsArray[decisionEngineOptionTab].rating[
                                    criteriaMobileIndex
                                ].value
                            }
                        />
                    </div>
                </>
            ) : (
                ratingsArray[decisionEngineOptionTab] &&
                ratingsArray[decisionEngineOptionTab]?.rating.map(
                    (item: Rating, index: number) =>
                        item.criteria && (
                            <div
                                className="mt-8 flex w-full flex-col p-1"
                                key={`rating-tab-slider-${index}`}
                            >
                                <RatingSelector
                                    registerName={
                                        `ratings.${decisionEngineOptionTab}.rating.${index}.value` as const
                                    }
                                    title={item.criteria}
                                    value={item.value}
                                />
                            </div>
                        )
                )
            )}
        </>
    )
}
