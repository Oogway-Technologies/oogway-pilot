import React, { FC, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import { liStyle } from '../../styles/utils'

interface OptionSliderProps {
    showValues?: boolean
    min?: number
    max?: number
    step?: number
    id: string
    registerName: string
    tooltip?: boolean
}

export const OptionSlider: FC<OptionSliderProps> = ({
    id,
    registerName,
    showValues,
    min = 1,
    max = 6,
    step = 1,
    tooltip = false,
}: OptionSliderProps) => {
    const { register, getValues, setValue } = useFormContext()
    const [left, setLeft] = useState(1)

    useEffect(() => {
        setLeft(getValues(registerName))
        console.log('Bar value --- ', getValues(registerName))
    }, [registerName])

    return (
        <div className={`flex relative flex-col px-3 space-y-2 w-full`}>
            <input
                key={id}
                type="range"
                style={{
                    width: tooltip ? '95%' : '100%',
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
                onChange={({ target: { value } }) => {
                    setLeft(Number(value))
                    setValue(registerName, value)
                }}
            />

            {tooltip && (
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
            )}
            {showValues && (
                <ul className="flex justify-between w-full h-10">
                    <li className={liStyle}>
                        <span className="absolute ml-xl whitespace-nowrap">
                            Not at all
                        </span>
                    </li>
                    <li className={liStyle}>
                        <span className="absolute">Somewhat</span>
                    </li>
                    <li className={liStyle}>
                        <span className="absolute">Fairly</span>
                    </li>
                    <li className={liStyle}>
                        <span className="absolute mr-xl">Super</span>
                    </li>
                </ul>
            )}
        </div>
    )
}
