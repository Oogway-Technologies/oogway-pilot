import { UilPlus, UilTrash } from '@iconscout/react-unicons'
import React from 'react'
import { FC } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'

import { bodyHeavy } from '../../../styles/typography'
import { inputStyle } from '../../../styles/utils'
import { shortLimit } from '../../../utils/constants/global'
import { OptionSlider } from '../OptionSlider'

export const CriteriaTab: FC = () => {
    const { register, control } = useFormContext()
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'cost',
    })
    return (
        <>
            {fields.map((item, index) => (
                <>
                    <div key={item.id} className={'flex items-center w-full'}>
                        <input
                            className={inputStyle}
                            type="text"
                            placeholder={`Cost of living`}
                            {...register(`option.${index}.name`, {
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
                                onClick={() => append({ name: '' })}
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
                    <OptionSlider showValues={true} />
                </>
            ))}
        </>
    )
}
