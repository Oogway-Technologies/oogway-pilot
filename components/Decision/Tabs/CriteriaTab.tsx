import { UilPlus, UilTrash } from '@iconscout/react-unicons'
import React from 'react'
import { FC } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'

import { bodyHeavy } from '../../../styles/typography'
import { inputStyle } from '../../../styles/utils'
import { shortLimit } from '../../../utils/constants/global'
import { OptionSlider } from '../OptionSlider'

export const CriteriaTab: FC = () => {
    const { register, control, watch } = useFormContext()
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'criteria',
    })
    const watchOptions = watch('options')
    return (
        <>
            {fields.map((item, index) => (
                <React.Fragment key={item.id}>
                    <div className={'flex items-center w-full'}>
                        <input
                            key={item.id}
                            className={inputStyle}
                            type="text"
                            placeholder={`Cost of living`}
                            {...register(`criteria.${index}.name` as const, {
                                required: {
                                    value: true,
                                    message:
                                        'You must enter the required Cost.',
                                },
                                maxLength: {
                                    value: shortLimit,
                                    message: `Cost length should be less than ${shortLimit}`,
                                },
                            })}
                        />
                        {index === 0 ? (
                            <button
                                className="p-1 ml-3 align-middle bg-primary rounded-full"
                                type="button"
                                onClick={() => {
                                    append({
                                        name: '',
                                        weight: 1,
                                        rating: Array(watchOptions.length).fill(
                                            5
                                        ),
                                    })
                                }}
                            >
                                <UilPlus className={'fill-white'} />
                            </button>
                        ) : (
                            <button
                                className="p-1 ml-3"
                                type="button"
                                onClick={() => remove(index)}
                            >
                                <UilTrash className={'fill-neutral-700'} />
                            </button>
                        )}
                    </div>
                    {index === 0 && (
                        <span
                            className={`flex justify-start items-center mr-auto text-neutral-700 pt-4 ${bodyHeavy}`}
                        >
                            And how important is this to you?
                        </span>
                    )}
                    <OptionSlider
                        id={item.id}
                        registerName={`criteria.${index}.weight` as const}
                        min={1}
                        max={4}
                        step={1}
                        showValues={true}
                    />
                </React.Fragment>
            ))}
        </>
    )
}
