import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'

import { liStyle } from '../../styles/utils'

interface OptionSliderProps {
    showValues?: boolean
    min?: number
    max?: number
    step?: number
    id: string
    registerName: string
}

export const OptionSlider: FC<OptionSliderProps> = ({
    id,
    registerName,
    showValues,
    min = 1,
    max = 6,
    step = 1,
}: OptionSliderProps) => {
    const { register } = useFormContext()
    return (
        <div className="flex z-10 flex-col p-2 space-y-2 w-full">
            <input
                key={id}
                type="range"
                className={'px-xl cursor-pointer custom-slider'}
                min={min}
                max={max}
                step={step}
                {...register(registerName, {
                    valueAsNumber: true,
                    min: min,
                    max: max,
                })}
            />
            {showValues && (
                <ul className="flex z-[-1] justify-between px-xl w-full h-10">
                    <li className={liStyle}>
                        <div className="absolute top-[-30px] left-[7px] h-10 border " />

                        <span className="absolute">Not at all important</span>
                    </li>
                    <li className={liStyle}>
                        <div className="absolute top-[-30px] left-[2px] h-10 border " />

                        <span className="absolute">Somewhat Important</span>
                    </li>
                    <li className={liStyle}>
                        <div className="absolute top-[-30px] left-[-4px] h-10 border " />

                        <span className="absolute">Fairly Important</span>
                    </li>
                    <li className={liStyle}>
                        <div className="absolute top-[-30px] left-[-9px] h-10 border " />

                        <span className="absolute">Super Important</span>
                    </li>
                </ul>
            )}
        </div>
    )
}
