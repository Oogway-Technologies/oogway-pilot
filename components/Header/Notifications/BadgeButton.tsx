import React, { FC } from 'react'

import { caption } from '../../../styles/typography'

interface BadgeButtonProps {
    className?: string
    numOfNotifications: number
    buttonName: string
    onClick: () => void
}
export const BadgeButton: FC<BadgeButtonProps> = ({
    className,
    numOfNotifications,
    buttonName,
    onClick,
}: BadgeButtonProps) => {
    return (
        <div
            className={`inline-block relative cursor-pointer ${
                className ? className : ''
            }`}
            onClick={() => onClick()}
        >
            <div
                className={
                    caption +
                    'box-border relative inline-block justify-center items-center rounded-lg p-2 border-[1px] border-neutral-150'
                }
            >
                {buttonName}
            </div>

            <span className="inline-flex absolute top-0 right-0 justify-center items-center w-4 h-4 text-xs not-italic font-semibold tracking-normal text-primary bg-tertiary rounded-full translate-x-1/2 -translate-y-1/2">
                {numOfNotifications}
            </span>
        </div>
    )
}
