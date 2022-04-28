import React, { FC, useEffect } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'

import { setDecisionEngineBestOption } from '../../../features/utils/utilsSlice'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { feedToolbarClass } from '../../../styles/feed'
import { bodyHeavy } from '../../../styles/typography'
import { decisionOption } from '../../../utils/types/firebase'
import { ResultCard } from '../ResultCard'

interface ResultTabProps {
    setCurrentTab: React.Dispatch<React.SetStateAction<number>>
}

export const ResultTab: FC<ResultTabProps> = ({
    setCurrentTab,
}: ResultTabProps) => {
    const { control, setValue, reset, getValues } = useFormContext()

    const optionIndex = useAppSelector(
        state => state.utilsSlice.decisionEngineOptionTab
    )

    const options: Array<decisionOption> = useWatch({
        control,
        name: 'options',
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
    }, [options])

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
                            ratingArray={
                                getValues('ratings')[optionIndex].rating
                            }
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
                <button
                    className={feedToolbarClass.newPostButton}
                    onClick={() => console.log(getValues())}
                >
                    Get Feedback
                </button>
            </div>
        </>
    )
}
