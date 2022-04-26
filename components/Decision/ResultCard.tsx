import React, { FC, useEffect } from 'react'
import { FieldValues, UseFormSetValue } from 'react-hook-form'

interface ResultCardProps {
    optionIndex: number
    option: { name: string; score: number }
    criteriaArray: Array<{ name: string; weight: number; rating: number[] }>
    setValue: UseFormSetValue<FieldValues>
}

export const ResultCard: FC<ResultCardProps> = ({
    optionIndex,
    option,
    criteriaArray,
    setValue,
}: ResultCardProps) => {
    // Update scores on mount
    useEffect(() => {
        setValue(`options.${optionIndex}.score`, calcScore())
    }, [])

    const calcScore = (): number => {
        let sumWeights = 0
        let sumWeightedScore = 0
        for (const criteria of criteriaArray) {
            sumWeights += criteria.weight
            sumWeightedScore += criteria.weight * criteria.rating[optionIndex]
        }
        return parseFloat((sumWeightedScore / sumWeights).toFixed(1))
    }

    return (
        <div className="flex flex-col justify-center items-center p-6 m-1 w-56 bg-white rounded-2xl shadow-md">
            <span className="mb-2 text-2xl font-normal leading-6 text-neutral-700">
                {option.name}
            </span>
            <div
                className="flex justify-center items-center w-20 h-20 rounded-full"
                style={{ background: '#EFEAFF' }}
            >
                <span className="text-3xl font-bold text-primary">
                    {option.score}
                </span>
            </div>
        </div>
    )
}
