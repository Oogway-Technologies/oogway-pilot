import React, { FC, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

import { setDecisionRatingUpdate } from '../../../features/decision/decisionSlice'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { bodyHeavy } from '../../../styles/typography'
import { OptionSlider } from '../OptionSlider'

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
            const optiosnList = getValues('options')
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
            optiosnList.forEach((item: { name: string }) => {
                mapRatingObject.push({
                    option: item.name,
                    rating: reShapeCriteriaList,
                })
            })
            setValue('ratings', mapRatingObject)
            useAppDispatch(setDecisionRatingUpdate(false))
        }
    }, [])

    return (
        <>
            {getValues('ratings')[optionIndex].rating.map(
                (
                    item: {
                        id: string
                        criteria: string
                    },
                    index: number
                ) =>
                    item.criteria ? (
                        <React.Fragment key={item.id + index}>
                            <div className="flex flex-col pl-5 mt-8 w-full">
                                <div className="flex items-center mb-4">
                                    <span
                                        className={`${bodyHeavy} text-neutral-700 dark:text-neutral-300 flex justify-start items-center mr-auto mb-xl pb-3`}
                                    >
                                        {item.criteria}
                                    </span>
                                </div>
                                <OptionSlider
                                    id={item.id + index}
                                    registerName={
                                        `ratings.${optionIndex}.rating.${index}.value` as const
                                    }
                                    min={1}
                                    max={10}
                                    step={1}
                                    tooltip
                                />
                            </div>
                        </React.Fragment>
                    ) : null
            )}
        </>
    )
}
