import {
    UilChartGrowthAlt,
    UilSlidersVAlt,
    UilTimes,
    UilTrophy,
} from '@iconscout/react-unicons'
import React from 'react'

import { body, bodyHeavy, bodySmall } from '../../../styles/typography'
import { EqualIcon } from '../../../utils/icons/CustomIcons'
import { BaseCard } from '../common/BaseCard'

export const ScoreCard = () => {
    return (
        <BaseCard className="flex flex-col py-4 px-6 mb-4 space-y-4">
            <span className={`${bodyHeavy} text-neutral-700`}>
                How did we get these scores?
            </span>
            <span className={`${body} text-neutral-700 text-justify`}>
                We multiplied each option’s criteria rating with the weight of
                the criteria importance, to get the final score.
            </span>
            <BaseCard className="flex items-center py-4 px-2 space-x-2">
                <div className="flex flex-col items-center space-y-4 text-center">
                    <UilChartGrowthAlt className="w-8 h-8 fill-primary dark:fill-primaryDark" />
                    <span
                        className={`${bodySmall} text-primary dark:text-primaryDark`}
                    >
                        Sum of Rating
                    </span>
                </div>
                <UilTimes className="w-6 h-6 fill-primary dark:fill-primaryDark" />
                <div className="flex flex-col items-center space-y-4 text-center">
                    <UilSlidersVAlt className="w-8 h-8 fill-primary dark:fill-primaryDark" />
                    <span
                        className={`${bodySmall} text-primary dark:text-primaryDark`}
                    >
                        Criteria Importance
                    </span>
                </div>
                <EqualIcon className="w-4 h-4 fill-primary dark:fill-primaryDark" />
                <div className="flex flex-col items-center space-y-4 text-center">
                    <UilTrophy className="w-8 h-8 fill-primary dark:fill-primaryDark" />

                    <span
                        className={`${bodySmall} text-primary dark:text-primaryDark`}
                    >
                        Score
                    </span>
                </div>
            </BaseCard>
        </BaseCard>
    )
}
