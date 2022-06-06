import { FC } from 'react'

import { bodyHeavy, bodySmall } from '../../../styles/typography'
import { BaseCard } from '../common/BaseCard'

interface DecisionInfoProps {
    className?: string
    title: string
    paragraph: string
}

export const DecisionInfo: FC<DecisionInfoProps> = ({
    className,
    title,
    paragraph,
}: DecisionInfoProps) => {
    return (
        <BaseCard className={`flex flex-col p-3 ${className ? className : ''}`}>
            <span
                className={`${bodyHeavy} mb-3 mt-2 text-neutral-700 dark:text-neutralDark-150`}
            >
                {title}
            </span>
            <span
                className={`${bodySmall} mb-5 text-neutral-700 dark:text-neutralDark-150`}
            >
                {paragraph}
            </span>
        </BaseCard>
    )
}
