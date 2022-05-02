import { FC } from 'react'

import { bodyHeavy, bodySmall } from '../../../styles/typography'

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
        <div
            className={`flex flex-col bg-white rounded-2xl shadow-md p-3 dark:bg-neutralDark-500 dark:shadow-black/60   ${
                className ? className : ''
            }`}
        >
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
        </div>
    )
}
