import { UilArrowUpLeft } from '@iconscout/react-unicons'
import React from 'react'
import { useFormContext } from 'react-hook-form'

import useMediaQuery from '../../../hooks/useMediaQuery'
import { body, bodyHeavy } from '../../../styles/typography'
import { BaseCard } from '../common/BaseCard'

export const QuestionCard = () => {
    const { getValues } = useFormContext()
    const isMobile = useMediaQuery('(max-width: 965px)')

    return (
        <BaseCard
            className={`flex flex-col py-4 px-3 my-1 mx-auto ${
                isMobile ? 'w-[99%]' : 'w-[98%]'
            }`}
        >
            <div className="flex items-center">
                <span
                    className={`${bodyHeavy} text-neutral-800 dark:text-white truncate`}
                >
                    {getValues('question')}
                </span>

                <UilArrowUpLeft
                    className={'ml-auto fill-neutral-700 dark:fill-white'}
                />
            </div>

            <span
                className={`${body} text-neutral-700 dark:text-neutral-150 truncate`}
            >
                {getValues('context')}
            </span>
        </BaseCard>
    )
}
