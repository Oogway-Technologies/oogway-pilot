import React, { FC, useEffect } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'

import { setDecisionEngineBestOption } from '../../../features/utils/utilsSlice'
import { useAppDispatch } from '../../../hooks/useRedux'
import { feedToolbarClass } from '../../../styles/feed'
import { bodyHeavy } from '../../../styles/typography'
import { decisionCriteria, decisionOption } from '../../../utils/types/firebase'
import { ResultCard } from '../ResultCard'

interface ResultTabProps {
    setCurrentTab: React.Dispatch<React.SetStateAction<number>>
}

export const ResultTab: FC<ResultTabProps> = ({
    setCurrentTab,
}: ResultTabProps) => {
    const { control, setValue, reset } = useFormContext()
    const options: Array<decisionOption> = useWatch({
        control,
        name: 'options',
    })
    const criteria: Array<decisionCriteria> = useWatch({
        control,
        name: 'criteria',
    })

    // Determine best option from scores on mount.
    // Edge case: ties not accounted for
    useEffect(() => {
        let currentBestScore = 0
        let currentBestName = ''
        for (const option of options) {
            if (option.score > currentBestScore) {
                currentBestName = option.name
                currentBestScore = option.score
            }
        }
        useAppDispatch(setDecisionEngineBestOption(currentBestName))
    }, [options, criteria])

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
                {options.map((option, index) => (
                    <ResultCard
                        key={index}
                        optionIndex={index}
                        option={option}
                        criteriaArray={criteria}
                        setValue={setValue}
                    />
                ))}
            </div>
            <div className="flex items-center pt-5 space-x-6">
                <button
                    onClick={handleReset}
                    className={feedToolbarClass.newPostButton}
                >
                    New Decision
                </button>
                <button className={feedToolbarClass.newPostButton}>
                    Get Feedback
                </button>
            </div>
        </>
    )
}
