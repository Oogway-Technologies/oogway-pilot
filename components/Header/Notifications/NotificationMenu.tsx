import { UilTrashAlt } from '@iconscout/react-unicons'
import React from 'react'

import { bodyHeavy, bodySmall } from '../../../styles/typography'
import { BadgeButton } from './BadgeButton'
import { NotificationBlock } from './NotificationBlock'

export const NotificationMenu = () => {
    return (
        <div className="flex flex-col px-3 pt-6 mt-2 mr-sm bg-white dark:bg-neutralDark-500 rounded-2xl focus:outline-none drop-shadow">
            <div className="flex items-center">
                <span className={bodyHeavy}>Notifications</span>
                <span
                    className={
                        bodySmall +
                        'text-primary dark:text-primaryDark self-end ml-auto cursor-pointer'
                    }
                >
                    Mark All As Read
                </span>
            </div>
            <div className="flex items-center my-5 space-x-2">
                <BadgeButton
                    numOfNotifications={1}
                    buttonName="Likes"
                    onClick={() => alert('needs function')}
                />
                <BadgeButton
                    numOfNotifications={7}
                    buttonName="Comments"
                    onClick={() => alert('needs function')}
                />
                <BadgeButton
                    numOfNotifications={12}
                    buttonName="Replies"
                    onClick={() => alert('needs function')}
                />
                <BadgeButton
                    numOfNotifications={9}
                    buttonName="Votes"
                    onClick={() => alert('needs function')}
                />
            </div>
            <div className="flex flex-col space-y-2">
                <NotificationBlock
                    time="2 hours"
                    title="Ten new votes on Pizza Poll"
                    username="username"
                    isNew={true}
                />
                <NotificationBlock
                    time="2 hours"
                    title="Ten new votes on Pizza Poll"
                    username="username"
                    isNew={true}
                />
                <NotificationBlock
                    time="2 hours"
                    title="Ten new votes on Pizza Poll"
                    username="username"
                    isNew={false}
                />
                <NotificationBlock
                    time="2 hours"
                    title="Ten new votes on Pizza Poll"
                    username="username"
                    isNew={true}
                />
            </div>
            <div className="flex items-end py-3">
                <UilTrashAlt className={'self-end ml-auto'} />
            </div>
        </div>
    )
}
