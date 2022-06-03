import {
    UilChartGrowthAlt,
    UilSlidersVAlt,
    UilTimes,
    UilTrophy,
} from '@iconscout/react-unicons'
import React from 'react'

import { bodySmall } from '../../../styles/typography'
import { EqualIcon } from '../../../utils/icons/CustomIcons'
import { BaseCard } from '../common/BaseCard'

export const ScoreCard = () => {
    return (
        <BaseCard className="flex flex-col py-6 px-4">
            <BaseCard className="flex items-center py-5 px-3 space-x-3">
                <div className="flex flex-col items-center space-y-4">
                    <UilChartGrowthAlt className="w-8 h-8 fill-primary dark:fill-primaryDark" />
                    <span
                        className={`${bodySmall} text-primary dark:text-primaryDark`}
                    >
                        Sum of Rating
                    </span>
                </div>

                <UilTimes className="w-4 h-4 fill-primary dark:fill-primaryDark" />
                <div className="flex flex-col items-center space-y-4">
                    <UilSlidersVAlt className="w-8 h-8 fill-primary dark:fill-primaryDark" />
                    <span
                        className={`${bodySmall} text-primary dark:text-primaryDark`}
                    >
                        Criteria Importance
                    </span>
                </div>

                <EqualIcon className="w-4 h-4 fill-primary dark:fill-primaryDark" />
                <UilTrophy className="w-8 h-8 fill-primary dark:fill-primaryDark" />
            </BaseCard>
        </BaseCard>
    )
}
