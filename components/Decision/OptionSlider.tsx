import React, { FC } from 'react'

interface OptionSliderProps {
    showValues?: boolean
    min?: number
    max?: number
    step?: number
}
export const OptionSlider: FC<OptionSliderProps> = ({
    showValues,
    min = 1,
    max = 6,
    step = 1,
}: OptionSliderProps) => {
    return (
        <div className="flex z-10 flex-col p-2 space-y-2 w-full">
            <input
                type="range"
                className={'px-xl cursor-pointer custom-slider'}
                min={min}
                max={max}
                step={step}
                onClick={evt => {
                    console.log(evt.currentTarget.value)
                }}
            />
            {showValues && (
                <ul className="flex z-[-1] justify-between px-xl w-full h-10">
                    <li className="flex relative justify-center pt-4 text-sm font-normal leading-4 text-center text-neutral-700">
                        <div className="absolute top-[-30px] left-[7px] h-10 border " />

                        <span className="absolute">Not at all important</span>
                    </li>
                    <li className="flex relative justify-center pt-4 text-sm font-normal leading-4 text-center text-neutral-700">
                        <div className="absolute top-[-30px] left-[2px] h-10 border " />

                        <span className="absolute">Somewhat Important</span>
                    </li>
                    <li className="flex relative justify-center pt-4 text-sm font-normal leading-4 text-center text-neutral-700">
                        <div className="absolute top-[-30px] left-[-4px] h-10 border " />

                        <span className="absolute">Fairly Important</span>
                    </li>
                    <li className="flex relative justify-center pt-4 text-sm font-normal leading-4 text-center text-neutral-700">
                        <div className="absolute top-[-30px] left-[-9px] h-10 border " />

                        <span className="absolute">Super Important</span>
                    </li>
                </ul>
            )}
        </div>
    )
}
