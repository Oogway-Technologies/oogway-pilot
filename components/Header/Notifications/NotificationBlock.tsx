import React, { FC } from 'react'

import { bodySmall, caption } from '../../../styles/typography'

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
            className={`flex flex-col justify-start py-1.5 px-2 rounded-lg w-full ${
                isNew ? 'bg-primary/10 dark:bg-primaryDark/10 ' : ''
            } ${className ? className : ''}`}
        >
            <span className={bodySmall}>{title}</span>
            <div className="flex items-center mt-2">
                <span
                    className={
                        caption + ' text-primary dark:text-primaryDark mr-2.5'
                    }
                >
                    @{username}
                </span>
                <span className={caption}>{time}</span>
            </div>
        </div>
    )
}
