import { UilPlusCircle } from '@iconscout/react-unicons'
import React, { FC } from 'react'

import { body, bodyHeavy } from '../../../styles/typography'
import { BaseCard } from '../common/BaseCard'

interface AISuggestionInfoCardProps {
    className?: string
}
export const AISuggestionInfoCard: FC<AISuggestionInfoCardProps> = ({
    className = '',
}: AISuggestionInfoCardProps) => {
    return (
        <BaseCard className={`flex flex-col py-2.5 px-3  ${className}`}>
            <div className="flex overflow-scroll space-x-3 snap-x snap-mandatory scrollbar-hide">
                <div className="flex flex-col space-y-4 min-w-full snap-center">
                    <div className="flex items-center space-x-2">
                        <UilPlusCircle />
                        <span className={bodyHeavy}>Nightlife</span>
                    </div>
                    <span className={`${body} text-neutral-700`}>
                        Nightlife is a collective term for entertainment that is
                        available and generally more popular from the late
                        evening into the early hours of the morning. It includes
                        pubs, bars, nightclubs.
                    </span>
                    <img
                        className="object-fill w-full h-36 rounded-lg"
                        src={
                            'https://media.cntraveler.com/photos/5b96b33ecdf9990ad19a02c2/4:5/w_2132,h_2665,c_limit/Salon-zur-Wilden-Renat_0421.jpg'
                        }
                        alt={'hero-suggestion-image'}
                    />
                </div>
                <div className="flex flex-col  space-y-4 min-w-full snap-center">
                    <div className="flex items-center space-x-2">
                        <UilPlusCircle />
                        <span className={bodyHeavy}>Nightlife</span>
                    </div>
                    <span className={`${body} text-neutral-700`}>
                        Nightlife is a collective term for entertainment that is
                        available and generally more popular from the late
                        evening into the early hours of the morning. It includes
                        pubs, bars, nightclubs.
                    </span>
                    <img
                        className="object-fill w-full h-36 rounded-lg"
                        src={
                            'https://media.cntraveler.com/photos/5b96b33ecdf9990ad19a02c2/4:5/w_2132,h_2665,c_limit/Salon-zur-Wilden-Renat_0421.jpg'
                        }
                        alt={'hero-suggestion-image'}
                    />
                </div>
            </div>

            <div className="flex justify-center items-center mt-3 space-x-3 w-full h-fit">
                <span className="w-3 h-3 bg-white rounded-full border-2 border-primary" />
                <span className="w-3 h-3 bg-[#D9D9D9] rounded-full border-2 border-transparent" />
            </div>
        </BaseCard>
    )
}
