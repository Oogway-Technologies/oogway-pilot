import React, { FC, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import Slider from 'react-rangeslider'

import { liStyle } from '../../styles/utils'

interface OptionSliderProps {
    showValues?: boolean
    min?: number
    max?: number
    step?: number
    registerName: string
    tooltip?: boolean
}

export const OptionSlider: FC<OptionSliderProps> = ({
    registerName,
    showValues,
    min = 1,
    max = 6,
    step = 1,
    tooltip = false,
}: OptionSliderProps) => {
    const { getValues, setValue } = useFormContext()
    const [currentState, setCurrentState] = useState(1)

    useEffect(() => {
        setCurrentState(getValues(registerName))
    }, [registerName])
    return (
        <div className={`flex relative flex-col px-3 space-y-2 w-full`}>
            <Slider
                min={min}
                max={max}
                step={step}
                tooltip={tooltip}
                value={currentState}
                onChange={v => {
                    setCurrentState(v)
                    setValue(registerName, v)
                }}
            />
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
