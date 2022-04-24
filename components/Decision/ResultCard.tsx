import React, { FC } from 'react'

interface ResultCardProps {
    name: string
    points: number
}

export const ResultCard: FC<ResultCardProps> = ({
    name,
    points,
}: ResultCardProps) => {
    return (
        <div className="flex flex-col justify-center items-center p-6 m-1 w-56 bg-white rounded-2xl shadow-md">
            <span className="mb-2 text-2xl font-normal leading-6 text-neutral-700">
                {name}
            </span>
            <div
                className="flex justify-center items-center w-20 h-20 rounded-full"
                style={{ background: '#EFEAFF' }}
            >
                <span className="text-3xl font-bold text-primary">
                    {points}
                </span>
            </div>
        </div>
    )
}
