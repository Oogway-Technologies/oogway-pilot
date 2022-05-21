import { FC } from 'react'

import { bodySmall } from '../../../styles/typography'

interface ProgressBarProps {
    className?: string
    totalSteps: number
    currentStep: number
    alignVertical?: boolean
    separator?: string
}

export const ProgressBar: FC<ProgressBarProps> = ({
    className,
    totalSteps,
    currentStep,
    alignVertical = false,
    separator = 'of',
}: ProgressBarProps) => {
    return (
        <div
            className={`flex ${
                alignVertical ? '' : 'flex-col justify-center '
            } items-center w-full ${className ? className : ''}`}
        >
            {!alignVertical && (
                <span
                    className={`${bodySmall} mb-2 text-neutral-700 dark:text-neutralDark-150`}
                >
                    {currentStep} of {totalSteps}
                </span>
            )}
            <div className={`w-full h-2 bg-gray-200  rounded-full`}>
                <div
                    className="h-2 bg-primary dark:bg-primaryDark rounded-full transition-all"
                    style={{
                        width: `${
                            ((currentStep - 1) / (totalSteps - 1)) * 100
                        }%`,
                    }}
                />
            </div>
            {alignVertical && (
                <span
                    className={`${bodySmall} text-neutral-700 dark:text-neutralDark-150 whitespace-nowrap ml-3`}
                >
                    {currentStep} {separator} {totalSteps}
                </span>
            )}
        </div>
    )
}
