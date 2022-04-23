import {
    UilComment,
    UilEstate,
    UilThumbsUp,
    UilUsersAlt,
} from '@iconscout/react-unicons'
import React, { FC } from 'react'

import { profileEngagementBarClass } from '../../styles/profile'
import { EngagementItems } from '../../utils/types/global'
import Button from '../Utils/Button'

interface ProfileEngagementBarProps {
    expanded?: boolean
}

const ProfileEngagementBar: FC<
    React.PropsWithChildren<React.PropsWithChildren<ProfileEngagementBarProps>>
> = () => {
    // Items
    const engagementItems: EngagementItems[] = [
        {
            icon: <UilEstate />,
            text: 'Posts',
            onClick: () => {
                alert('TODO')
            },
        },
        {
            icon: <UilComment />,
            text: 'Comments',
            onClick: () => {
                alert('TODO')
            },
        },
        {
            icon: <UilThumbsUp />,
            text: 'Likes',
            onClick: () => {
                alert('TODO')
            },
        },
        {
            icon: <UilUsersAlt />,
            text: '123 Following',
            onClick: () => {
                alert('TODO')
            },
        },
    ]

    return (
        <div className={profileEngagementBarClass.engagementBar}>
            {engagementItems.map((item, idx) => (
                <Button
                    key={idx}
                    addStyle={profileEngagementBarClass.engagementButton}
                    type="button"
                    onClick={item.onClick}
                    icon={item.icon}
                    keepText={false}
                    text={item.text}
                />
            ))}
        </div>
    )
}

export default ProfileEngagementBar
