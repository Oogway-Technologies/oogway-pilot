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
            } w-full items-center ${className ? className : ''}`}
        >
            {!alignVertical && (
                <span
                    className={`${bodySmall} mb-2 text-neutral-700 dark:text-neutralDark-150`}
                >
                    {currentStep} of {totalSteps}
                </span>
            )}
            <div className={`h-2 w-full rounded-full  bg-gray-200`}>
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
                    className={`${bodySmall} ml-3 whitespace-nowrap text-neutral-700 dark:text-neutralDark-150`}
                >
                    {currentStep} {separator} {totalSteps}
                </span>
            )}
        </div>
    )
}
