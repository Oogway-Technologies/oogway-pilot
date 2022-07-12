import { UilPlusCircle } from '@iconscout/react-unicons'
import React, { FC, useState } from 'react'

import { useAppSelector } from '../../../hooks/useRedux'
import { body, bodyHeavy } from '../../../styles/typography'
import { BaseCard } from '../common/BaseCard'

interface AISuggestionInfoCardProps {
    className?: string
}
export const AISuggestionInfoCard: FC<AISuggestionInfoCardProps> = ({
    className = '',
}: AISuggestionInfoCardProps) => {
    const infoCards = useAppSelector(state => state.decisionSlice.infoCards)
    const [cardIdx, setCardIdx] = useState<number>(0)

    if (infoCards && infoCards.length > 0) {
        return (
            <BaseCard className={`mr-4 flex flex-col py-2.5 px-3 ${className}`}>
                <div className="flex snap-x snap-mandatory space-x-3 overflow-scroll scrollbar-hide">
                    <div className="flex min-w-full snap-center flex-col space-y-4">
                        <div className="flex items-center space-x-2">
                            <UilPlusCircle />
                            <span className={bodyHeavy}>
                                {infoCards[cardIdx].title}
                            </span>
                        </div>
                        <span className={`${body} text-neutral-700`}>
                            {infoCards[cardIdx].text}
                        </span>
                        {infoCards[cardIdx].media &&
                            infoCards[cardIdx].mediaType === 'img' && (
                                <img
                                    className="h-36 w-full rounded-lg object-fill"
                                    src={infoCards[cardIdx].media}
                                    alt={'hero-suggestion-image'} // Add alt field to infoCards
                                />
                            )}
                    </div>
                </div>

                <div className="mt-3 flex h-fit w-full items-center justify-center space-x-3">
                    {infoCards.map((_card, idx) => {
                        return (
                            <span
                                key={idx}
                                onClick={() => setCardIdx(idx)}
                                className={`h-3 w-3 rounded-full border-2 ${
                                    idx === cardIdx
                                        ? 'border-primary bg-white'
                                        : 'border-transparent bg-[#D9D9D9]'
                                }`}
                            />
                        )
                    })}
                </div>
            </BaseCard>
        )
    } else {
        return null
    }
}
