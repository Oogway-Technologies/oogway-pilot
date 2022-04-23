import React, { FC } from 'react'

import { caption } from '../../../styles/typography'
import { BadgeButtonStyles } from './NotificationStyles'

interface BadgeButtonProps {
    className?: string
    numOfNotifications: number
    buttonName: string
    onClick: () => void
}
export const BadgeButton: FC<
    React.PropsWithChildren<React.PropsWithChildren<BadgeButtonProps>>
> = ({
    className = '',
    numOfNotifications,
    buttonName,
    onClick,
}: BadgeButtonProps) => {
    return (
        <div
            className={BadgeButtonStyles.body + className}
            onClick={() => onClick()}
        >
            <div className={caption + BadgeButtonStyles.button}>
                {buttonName}
            </div>

            <span className={BadgeButtonStyles.badge}>
                {numOfNotifications}
            </span>
        </div>
    )
}
