import {
    UilArrowDownRight,
    UilChartGrowthAlt,
    UilSlidersVAlt,
    UilTimes,
    UilTrophy,
} from '@iconscout/react-unicons'
import React, { useState } from 'react'

import useMediaQuery from '../../../hooks/useMediaQuery'
import { body, bodyHeavy, bodySmall } from '../../../styles/typography'
import { EqualIcon } from '../../../utils/icons/CustomIcons'
import { Collapse } from '../../Utils/common/Collapse'
import { BaseCard } from '../common/BaseCard'

export const ScoreCard = () => {
    const [isOpen, setOpen] = useState(false)
    const isMobile = useMediaQuery('(max-width: 965px)')

    return (
        <BaseCard className="flex flex-col p-4 mb-4">
            <div
                className="flex items-center cursor-pointer"
                onClick={() => setOpen(!isOpen)}
            >
                <span
                    className={`${bodyHeavy} text-neutral-700 dark:text-neutral-150 w-full`}
                >
                    How did we get these scores?
                </span>
                <UilArrowDownRight
                    className={`fill-neutral-700 dark:fill-neutral-150 transition-all ${
                        isOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                />
            </div>
            <Collapse
                show={isOpen}
                customHeight={isMobile ? 'h-72' : 'h-64'}
                className="flex flex-col justify-around"
            >
                <div className="py-2" />
                <span
                    className={`${body} text-neutral-700 text-justify dark:text-white`}
                >
                    We multiplied each option’s criteria rating with the weight
                    of the criteria importance, to get the final score.
                </span>
                <div className="py-1" />
                <BaseCard className="flex justify-around items-center py-4 px-2 mx-1 dark:bg-neutralDark-300">
                    <div className="flex flex-col items-center space-y-4 w-6 text-center md:w-12">
                        <UilChartGrowthAlt className="w-8 h-8 fill-primary dark:fill-primaryDark" />
                        <span
                            className={`${bodySmall} text-primary dark:text-primaryDark`}
                        >
                            Sum of Rating
                        </span>
                    </div>
                    <UilTimes className="w-6 h-6 fill-primary dark:fill-primaryDark" />
                    <div className="flex flex-col items-center space-y-4 w-6 text-center md:w-12">
                        <UilSlidersVAlt className="w-8 h-8 fill-primary dark:fill-primaryDark" />
                        <span
                            className={`${bodySmall} text-primary dark:text-primaryDark`}
                        >
                            Criteria Importance
                        </span>
                    </div>
                    <EqualIcon className="w-4 h-4 fill-primary dark:fill-primaryDark" />
                    <div className="flex flex-col items-center space-y-4 w-6 text-center md:w-12">
                        <UilTrophy className="w-8 h-8 fill-primary dark:fill-primaryDark" />
                        <span
                            className={`${bodySmall} text-primary dark:text-primaryDark`}
                        >
                            Score
                        </span>
                    </div>
                </BaseCard>
            </Collapse>
        </BaseCard>
    )
}
