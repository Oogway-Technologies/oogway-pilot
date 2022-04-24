import { UilLightbulbAlt } from '@iconscout/react-unicons'
import React from 'react'
import { FC } from 'react'
import { useFormContext } from 'react-hook-form'

import { inputStyle } from '../../../styles/utils'
import { longLimit, shortLimit } from '../../../utils/constants/global'

export const QuestionTab: FC = () => {
    const { register } = useFormContext()

    return (
        <>
            <input
                className={inputStyle}
                type="text"
                placeholder="Where should I move to?"
                {...register('question', {
                    required: {
                        value: true,
                        message: 'You must enter the required question.',
                    },
                    maxLength: {
                        value: shortLimit,
                        message: `Question length should be less than ${shortLimit}`,
                    },
                })}
            />
            <textarea
                className={`${inputStyle} h-40 resize-none`}
                placeholder="Context for your decision (optional)"
                {...register('context', {
                    maxLength: {
                        value: shortLimit,
                        message: `Context length should be less than ${longLimit}`,
                    },
                })}
            />
            <div className="flex justify-start items-center mr-auto cursor-pointer">
                <UilLightbulbAlt className="fill-neutral-300" />
                <span className="mx-2 text-neutral-300">
                    Stuck? Click here to view the most common decisions
                </span>
            </div>
        </>
    )
}
