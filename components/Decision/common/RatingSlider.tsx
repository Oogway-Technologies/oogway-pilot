import React, { FC, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import { setDecisionCriteriaQueryKey } from '../../../features/decision/decisionSlice'
import { useAppDispatch } from '../../../hooks/useRedux'
import { bodyHeavy, bodySmall } from '../../../styles/typography'
import AskAIButton from './AskAIButton'

interface RatingSliderProps {
    title: string
    min?: number
    max?: number
    step?: number
    id: string
    registerName: string
    highlight?: boolean
}

export const RatingSlider: FC<RatingSliderProps> = ({
    id,
    registerName,
    title,
    min = 1,
    max = 6,
    step = 1,
    highlight = false,
}: RatingSliderProps) => {
    const { register, getValues, setValue } = useFormContext()
    const [left, setLeft] = useState('')

    useEffect(() => {
        setLeft(getValues(registerName))
    }, [registerName])

    const handleChange = (value: string) => {
        if (value === '') {
            setLeft('')
            setValue(registerName, '')
        } else if (Number(value) < min) {
            setLeft(String(min))
            setValue(registerName, min)
        } else if (Number(value) > max) {
            setLeft(String(max))
            setValue(registerName, max)
        } else {
            setLeft(value)
            setValue(registerName, value)
        }
    }

    return (
        <div
            className={
                'flex relative flex-col p-5 space-y-2 w-full bg-white dark:bg-neutralDark-500 rounded-2xl custom-box-shadow'
            }
        >
            <div className="flex items-center">
                <span
                    className={`${bodyHeavy} ${
                        highlight
                            ? 'text-primary dark:text-primaryDark'
                            : 'text-neutral-700 dark:text-neutral-150'
                    } inline-flex items-center gap-x-md`}
                >
                    {title}{' '}
                    <AskAIButton
                        onClick={() =>
                            useAppDispatch(setDecisionCriteriaQueryKey(title))
                        }
                    />
                </span>
                <div
                    className={
                        'flex z-10 justify-self-end items-center ml-auto rounded-lg border border-neutral-150'
                    }
                >
                    <span
                        className={`${bodySmall} text-neutral-700/50 bg-neutral-150/30 dark:text-neutral-150 px-1 py-1.5`}
                    >
                        Rating
                    </span>
                    <input
                        className={`${bodySmall} my-1.5 mx-2 w-4 outline-none appearance-none bg-transparent ${
                            highlight
                                ? 'text-primary dark:text-primaryDark'
                                : 'text-neutral-700 dark:text-neutral-150'
                        }`}
                        value={left}
                        {...register(registerName, {
                            min: min,
                            max: max,
                            required: true,
                        })}
                        onChange={({ target: { value } }) =>
                            handleChange(value)
                        }
                    />
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <span className={`${bodySmall} text-neutral-300`}>1</span>
                <input
                    key={id}
                    type="range"
                    style={{
                        width: '100%',
                    }}
                    min={min}
                    max={max}
                    step={step}
                    value={left}
                    {...register(registerName, {
                        valueAsNumber: true,
                        min: min,
                        max: max,
                    })}
                    onChange={({ target: { value } }) => handleChange(value)}
                />
                <span className={`${bodySmall} text-neutral-300`}>10</span>
            </div>
            <div className="flex items-center">
                <span
                    className={`${bodySmall} text-neutral-300 p-2 rounded-full border border-neutral-300`}
                >
                    Not good
                </span>
                <span
                    className={`${bodySmall} text-neutral-300 p-2 rounded-full border border-neutral-300 justify-self-end ml-auto`}
                >
                    Excellent
                </span>
            </div>
        </div>
    )
}
