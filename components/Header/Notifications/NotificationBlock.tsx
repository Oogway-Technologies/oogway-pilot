import { FieldValue } from 'firebase/firestore'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FC } from 'react'

import { useProfileData } from '../../../hooks/useProfileData'
import { useAppSelector } from '../../../hooks/useRedux'
import { useUpdateEngagemmentActivity } from '../../../queries/engagementActivity'
import { bodySmall, caption } from '../../../styles/typography'
import {
    engagementAction,
    engagementTarget,
} from '../../../utils/types/firebase'
import Timestamp from '../../Utils/Timestamp'
import { NotificationBlockStyles } from './NotificationStyles'

interface NotificationBlockProps {
    className?: string
    engagementId: string | undefined
    action: engagementAction
    timestamp: FieldValue | undefined
    engagerId: string
    targetId: string
    targetObject: engagementTarget
    targetRoute: string
    isNew: boolean
    close?: (
        focusableElement?:
            | HTMLElement
            | React.MutableRefObject<HTMLElement | null>
            | undefined
    ) => void
}

export const NotificationBlock: FC<
    React.PropsWithChildren<React.PropsWithChildren<NotificationBlockProps>>
> = ({
    className,
    engagementId,
    action,
    timestamp,
    engagerId,
    targetId,
    targetObject,
    targetRoute,
    isNew,
    close,
}: NotificationBlockProps) => {
    const router = useRouter()

    // Stream engager profile
    const [engagerProfile] = useProfileData(engagerId)

    // Notification mutation hook
    const userProfile = useAppSelector(state => state.userSlice.user)
    const engagementMutation = useUpdateEngagemmentActivity(userProfile.uid)

    // Handler functions
    const goToProfile = (uid: string) => {
        // Close dropdown menu
        if (close) close()

        // Navigate to engager's profile
        router.push(`/profile/${uid}`)
    }

    const goToTarget = () => {
        // Generate full path to target
        const targetObjMap = {
            Poll: 'post',
            Comment: 'comment',
            Reply: 'reply',
            Post: 'post',
        }
        const tail = `#${targetObjMap[targetObject]}-${targetId}`

        // Close dropdown menu
        if (close) close()

        // Navigation to target item
        router.push('/' + targetRoute + tail)
    }

    const updateHandler = (id: string | undefined) => {
        // Only call mutation if Id is defined
        // Should always be defined otherwise user
        // wouldn't see this notification in the first place
        if (id) {
            const args = {
                id: id,
                body: { isNew: false },
            }
            engagementMutation.mutate(args)
        }
    }

    return (
        <div
            className={
                NotificationBlockStyles.body +
                `${isNew ? 'bg-primary/10 dark:bg-primaryDark/10 ' : ''} ${
                    className ? className : ''
                }`
            }
        >
            <span className={bodySmall}>
                {`New ${action} on your `}
                <a
                    onClick={() => {
                        // Update status and go to target
                        if (isNew) updateHandler(engagementId)
                        goToTarget()
                    }}
                    className={
                        NotificationBlockStyles.username + ' cursor-pointer'
                    }
                >
                    {targetObject}
                </a>
            </span>
            <div className={NotificationBlockStyles.innerBody}>
                <span
                    className={caption + NotificationBlockStyles.username}
                    onClick={() => goToProfile(engagerId)}
                >
                    <Link href={`/profile/${engagerId}`}>
                        <a>@{engagerProfile?.username}</a>
                    </Link>
                </span>
                <span className={caption}>
                    {timestamp && <Timestamp timestamp={timestamp} />}
                </span>
            </div>
        </div>
    )
}
