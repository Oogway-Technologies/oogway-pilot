import React, { FC, useEffect } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'

import {
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
    const { decisionEngineOptionTab, criteriaMobileIndex } = useAppSelector(
        state => state.decisionSlice
    )
    const ratingsArray = useWatch({ name: 'ratings', control })
    const isMobile = useMediaQuery('(max-width: 965px)')

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

        return () => {
            useAppDispatch(setPreviousIndex(4))
        }
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
                                className="flex flex-col p-1 mt-8 w-full"
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
