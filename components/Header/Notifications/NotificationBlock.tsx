import React, { FC } from 'react'

import { bodySmall, caption } from '../../../styles/typography'
import { NotificationBlockStyles } from './NotificationStyles'

interface NotificationBlockProps {
    className?: string
    title: string
    time: string
    username: string
    isNew: boolean
}

export const NotificationBlock: FC<NotificationBlockProps> = ({
    className,
    time,
    title,
    username,
    isNew,
}: NotificationBlockProps) => {
    return (
        <div
            className={
                NotificationBlockStyles.body +
                `${isNew ? 'bg-primary/10 dark:bg-primaryDark/10 ' : ''} ${
                    className ? className : ''
                }`
            }
        >
            <span className={bodySmall}>{title}</span>
            <div className={NotificationBlockStyles.innerBody}>
                <span className={caption + NotificationBlockStyles.username}>
                    @{username}
                </span>
                <span className={caption}>{time}</span>
            </div>
        </div>
    )
}
