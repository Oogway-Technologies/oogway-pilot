import React, { FC } from 'react'

interface OptionSliderProps {
    showValues?: boolean
}
export const OptionSlider: FC<OptionSliderProps> = ({
    showValues,
}: OptionSliderProps) => {
    return (
        <div className="flex z-10 flex-col p-2 space-y-2 w-full">
            <input
                type="range"
                className={'custom-slider'}
                min="1"
                max="6"
                step="1"
                onClick={evt => {
                    console.log(evt.currentTarget.value)
                }}
            />
            {showValues && (
                <ul className="flex z-[-1] justify-between w-full h-10">
                    <li className="flex relative justify-center" />
                    <li className="flex relative justify-center pt-4 text-sm font-normal leading-4 text-center text-neutral-700">
                        <div className="absolute top-[-30px] left-[3px] h-10 border " />

                        <span className="absolute">Not at all important</span>
                    </li>
                    <li className="flex relative justify-center pt-4 text-sm font-normal leading-4 text-center text-neutral-700">
                        <div className="absolute top-[-30px] left-[0px] h-10 border " />

                        <span className="absolute">Somewhat Important</span>
                    </li>
                    <li className="flex relative justify-center pt-4 text-sm font-normal leading-4 text-center text-neutral-700">
                        <div className="absolute top-[-30px] left-[-2px] h-10 border " />

                        <span className="absolute">Fairly Important</span>
                    </li>
                    <li className="flex relative justify-center pt-4 text-sm font-normal leading-4 text-center text-neutral-700">
                        <div className="absolute top-[-30px] left-[-6px] h-10 border " />

                        <span className="absolute">Super Important</span>
                    </li>
                    <li className="flex relative justify-center" />
                </ul>
            )}
        </div>
    )
}
