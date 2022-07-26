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
        <BaseCard className="mb-4 flex flex-col p-4">
            <div
                className="flex cursor-pointer items-center"
                onClick={() => setOpen(!isOpen)}
            >
                <span
                    className={`${bodyHeavy} w-full text-neutral-700 dark:text-neutral-150`}
                >
                    How did we get these scores?
                </span>
                <UilArrowDownRight
                    className={`fill-neutral-700 transition-all dark:fill-neutral-150 ${
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
                    className={`${body} text-justify text-neutral-700 dark:text-white`}
                >
                    We multiplied each option’s criteria rating with the weight
                    of the criteria importance, to get the final score.
                </span>
                <div className="py-1" />
                <BaseCard className="mx-1 flex items-center justify-around py-4 px-2 dark:bg-neutralDark-300">
                    <div className="flex w-6 flex-col items-center space-y-4 text-center md:w-12">
                        <UilChartGrowthAlt className="h-8 w-8 fill-primary dark:fill-primaryDark" />
                        <span
                            className={`${bodySmall} text-primary dark:text-primaryDark`}
                        >
                            Sum of Rating
                        </span>
                    </div>
                    <UilTimes className="h-6 w-6 fill-primary dark:fill-primaryDark" />
                    <div className="flex w-6 flex-col items-center space-y-4 text-center md:w-12">
                        <UilSlidersVAlt className="h-8 w-8 fill-primary dark:fill-primaryDark" />
                        <span
                            className={`${bodySmall} text-primary dark:text-primaryDark`}
                        >
                            Criteria Importance
                        </span>
                    </div>
                    <EqualIcon className="h-4 w-4 fill-primary dark:fill-primaryDark" />
                    <div className="flex w-6 flex-col items-center space-y-4 text-center md:w-12">
                        <UilTrophy className="h-8 w-8 fill-primary dark:fill-primaryDark" />
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
