import React, { FC, useEffect } from 'react'
import { FieldValues, UseFormSetValue } from 'react-hook-form'

import { resultCard } from '../../styles/decision'

interface ResultCardProps {
    optionIndex: number
    option: { name: string; score: number }
    setValue: UseFormSetValue<FieldValues>
    criteriaArray: Array<{ name: string; weight: number }>
    ratingsArray: Array<{ criteria: string; weight: number; value: number }>
}

export const ResultCard: FC<ResultCardProps> = ({
    optionIndex,
    option,
    setValue,
    criteriaArray,
    ratingsArray,
}: ResultCardProps) => {
    // Update scores on mount
    useEffect(() => {
        setValue(`options.${optionIndex}.score`, calcScore())
    }, [optionIndex])

    const calcScore = (): number => {
        let sumWeights = 0
        let sumWeightedScore = 0
        // Calculate denominator
        for (const criteria of criteriaArray) {
            sumWeights += criteria.weight
        }

        // Calculate numerator
        for (const rating of ratingsArray) {
            sumWeightedScore += rating.value * rating.weight
        }
        return parseFloat((sumWeightedScore / sumWeights).toFixed(1))
    }

    return (
        <div className={resultCard.container}>
            <span className={resultCard.optionName}>{option.name}</span>
            <div
                className={resultCard.innerDiv}
                style={{ background: '#EFEAFF' }}
            >
                <span className={resultCard.optionScore}>{option.score}</span>
            </div>
        </div>
    )
}
