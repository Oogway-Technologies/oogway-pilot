import React, { FC } from 'react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'

import { useAppSelector } from '../../../hooks/useRedux'
import { bodyHeavy } from '../../../styles/typography'
import { OptionSlider } from '../OptionSlider'

export const RatingTab: FC = () => {
    const optionIndex = useAppSelector(
        state => state.utilsSlice.decisionEngineOptionTab
    )
    const { control } = useFormContext()
    const { fields } = useFieldArray({
        control,
        name: 'criteria',
    })
    const watchCriteria = useWatch({ control, name: 'criteria' })

    return (
        <>
            {fields.map((item, index) => (
                <React.Fragment key={item.id}>
                    {index === 0 ? (
                        <div className="flex flex-col mt-8 w-full">
                            <div className="flex items-center mb-4">
                                <span
                                    className={`${bodyHeavy} text-neutral-700 dark:text-neutral-300 flex justify-start items-center mr-auto mb-xl pb-3`}
                                >
                                    {watchCriteria[index].name}
                                </span>
                                {/* Link input to criteria rating value */}
                            </div>
                            <OptionSlider
                                id={item.id}
                                registerName={
                                    `criteria.${index}.rating.${optionIndex}` as const
                                }
                                min={1}
                                max={10}
                                step={1}
                                tooltip
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col w-full">
                            <div className="flex items-center mb-4">
                                <span
                                    className={`${bodyHeavy} text-neutral-700 dark:text-neutral-300 flex justify-start items-center mr-auto mb-xl pb-3`}
                                >
                                    {watchCriteria[index].name}
                                </span>
                            </div>
                            <OptionSlider
                                id={item.id}
                                registerName={
                                    `criteria.${index}.rating.${optionIndex}` as const
                                }
                                min={1}
                                max={10}
                                step={1}
                                tooltip
                            />
                        </div>
                    )}
                </React.Fragment>
            ))}
        </>
    )
}
