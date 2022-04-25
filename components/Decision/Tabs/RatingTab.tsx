import React from 'react'
import { FC } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'

import { bodyHeavy } from '../../../styles/typography'
import { OptionSlider } from '../OptionSlider'

export const RatingTab: FC = () => {
    const { control, watch } = useFormContext()
    const { fields } = useFieldArray({
        control,
        name: 'criteria',
    })
    const watchCriteria = watch('criteria')

    return (
        <>
            {fields.map((item, index) => (
                <React.Fragment key={item.id}>
                    {index === 0 ? (
                        <div className="flex flex-col mt-8 w-full">
                            <div className="flex items-center mb-4">
                                <span
                                    className={`${bodyHeavy} text-neutral-700 flex justify-start items-center mr-auto`}
                                >
                                    {watchCriteria[index].name}
                                </span>
                                {/* Link input to criteria rating value */}
                                <input className="flex justify-end items-center p-1 ml-auto w-9 h-7 text-sm bg-transparent rounded border-[1px] focus-within:border-primary focus:border-primary focus-visible:border-primary active:border-neutral-300 border-solid focus:outline-none" />
                            </div>
                            <OptionSlider min={1} max={10} step={1} />
                        </div>
                    ) : (
                        <div className="flex flex-col w-full">
                            <div className="flex items-center mb-4">
                                <span
                                    className={`${bodyHeavy} text-neutral-700 flex justify-start items-center mr-auto`}
                                >
                                    {watchCriteria[index].name}
                                </span>
                                {/* Link input to criteria rating value */}
                                <input className="flex justify-end items-center p-1 ml-auto w-9 h-7 text-sm bg-transparent rounded border-[1px] focus-within:border-primary focus:border-primary focus-visible:border-primary active:border-neutral-300 border-solid focus:outline-none" />
                            </div>
                            <OptionSlider min={1} max={10} step={1} />
                        </div>
                    )}
                </React.Fragment>
            ))}
        </>
    )
}
