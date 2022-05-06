import React, { FC, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import { bodyHeavy, bodySmall } from '../../../styles/typography'

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
    const [left, setLeft] = useState(1)

    useEffect(() => {
        setLeft(getValues(registerName))
    }, [registerName])

    const handleChange = (value: string) => {
        setLeft(Number(value))
        setValue(registerName, value)
    }

    return (
        <div
            className={
                'flex relative flex-col p-5 space-y-2 w-full bg-white dark:bg-neutralDark-500 rounded-2xl shadow-inner drop-shadow-md'
            }
        >
            <div className="flex items-center">
                <span
                    className={`${bodyHeavy} ${
                        highlight
                            ? 'text-primary dark:text-primaryDark'
                            : 'text-neutral-700 dark:text-neutral-150'
                    }`}
                >
                    {title}
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
                        min={1}
                        max={10}
                        type="number"
                        className={`${bodySmall} my-1.5 mx-2 w-4 outline-none appearance-none ${
                            highlight
                                ? 'text-primary dark:text-primaryDark'
                                : 'text-neutral-700 dark:text-neutral-150'
                        }`}
                        value={left}
                        {...register(registerName, {
                            valueAsNumber: true,
                            min: min,
                            max: max,
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
            {/* {tooltip && (
                <label
                    htmlFor="range"
                    style={{
                        left: `${left * 10 - 10}%`,
                        marginLeft: `${4 + left}px`,
                    }}
                >
                    <svg width="31" height="35" viewBox="0 0 31 35" fill="none">
                        <path
                            d="M31 13.1591C31 19.1492 21.5547 29.8135 17.4133 34.2135C16.4203 35.2622 14.5797 35.2622 13.5867 34.2135C9.37266 29.8135 0 19.1492 0 13.1591C0 5.89142 6.93948 0 15.5 0C24.0573 0 31 5.89142 31 13.1591Z"
                            fill="#7269FF"
                        />
                    </svg>
                    <span
                        style={{ left: '50%', transform: 'translate(-50%, 0)' }}
                        className="absolute top-2 text-base font-normal text-white"
                    >
                        {left}
                    </span>
                </label>
            )} */}
        </div>
    )
}
