import React, { FC, useEffect } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'

import {
    setDecisionEngineBestOption,
    setPreviousIndex,
} from '../../../features/decision/decisionSlice'
import { useAppDispatch } from '../../../hooks/useRedux'
import { feedToolbarClass } from '../../../styles/feed'
import { bodyHeavy } from '../../../styles/typography'
import { decisionOption } from '../../../utils/types/firebase'
import { ResultCard } from '../common/ResultCard'

interface ResultTabProps {
    setCurrentTab: React.Dispatch<React.SetStateAction<number>>
}

export const ResultTab: FC<ResultTabProps> = ({
    setCurrentTab,
}: ResultTabProps) => {
    const { control, setValue, reset, getValues } = useFormContext()

    const options: Array<decisionOption> = useWatch({
        control,
        name: 'options',
    })

    // Determine best option from scores on mount.
    // Edge case: ties not accounted for
    useEffect(() => {
        useAppDispatch(setDecisionEngineBestOption(calcBestOption()))
        return () => {
            useAppDispatch(setPreviousIndex(5))
        }
    }, [options])

    const calcBestOption = () => {
        let currentBestScore = 0
        let currentBestOptions: string[] = []
        for (const option of options) {
            if (option.score > currentBestScore) {
                // If there's only one or zero current best option(s),
                // replace with new best
                if (currentBestOptions.length < 2) {
                    currentBestOptions[0] = option.name
                } else {
                    // If there's a current tie, but current option
                    // dominates both, replace the array
                    currentBestOptions = [option.name]
                }

                // Update new new best score
                currentBestScore = option.score
            }

            // If there's a tie, push to stack
            if (option.score === currentBestScore) {
                currentBestOptions.push(option.name)
            }
        }

        // In case of ties, randomly choose best option
        if (currentBestOptions.length > 1) {
            return currentBestOptions[
                (Math.random() * currentBestOptions.length) | 0
            ]
        } else {
            return currentBestOptions[0]
        }
    }

    // Handler functions
    const handleReset = () => {
        // reset form state
        reset()
        // Return to first tab
        setCurrentTab(1)
    }

    return (
        <>
            <span
                className={`${bodyHeavy} text-neutral-700 mt-5 flex justify-start items-center mr-auto dark:text-neutralDark-150`}
            >
                Scores
            </span>
            <div className="flex flex-wrap gap-3 justify-center items-center">
                {options.map((option, index) =>
                    option.name ? (
                        <ResultCard
                            key={index}
                            optionIndex={index}
                            option={option}
                            criteriaArray={getValues('criteria')}
                            ratingsArray={getValues(`ratings.${index}.rating`)}
                            setValue={setValue}
                        />
                    ) : null
                )}
            </div>
            <div className="flex items-center pt-5 space-x-6">
                <button
                    onClick={handleReset}
                    className={feedToolbarClass.newPostButton}
                >
                    New Decision
                </button>
                {/* <button
                    className={feedToolbarClass.newPostButton}
                    onClick={() => console.log(getValues())}
                >
                    Get Feedback
                </button> */}
            </div>
        </>
    )
}
