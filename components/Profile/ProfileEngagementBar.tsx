import React, { FC } from 'react'

import { EngagementItems } from '../../utils/types/global'
import Button from '../Utils/Button'
import { profileEngagementBarClass } from '../../styles/profile'

// @ts-ignore
import {
    UilComment,
    UilEstate,
    UilThumbsUp,
    UilUsersAlt,
} from '@iconscout/react-unicons'

interface ProfileEngagementBarProps {
    expanded: boolean
}

const ProfileEngagementBar: FC<ProfileEngagementBarProps> = ({}) => {
    // Items
    const engagementItems: EngagementItems[] = [
        {
            icon: <UilEstate />,
            text: 'Posts',
            onClick: () => {},
        },
        {
            icon: <UilComment />,
            text: 'Comments',
            onClick: () => {},
        },
        {
            icon: <UilThumbsUp />,
            text: 'Likes',
            onClick: () => {},
        },
        {
            icon: <UilUsersAlt />,
            text: '123 Following',
            onClick: () => {},
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
