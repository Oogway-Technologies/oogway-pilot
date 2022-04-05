import React, { FC, Fragment, useRef, useState } from 'react'

import useIntersectionObserver from '../../../hooks/useIntersectionObserver'
import { useAppSelector } from '../../../hooks/useRedux'
import {
    useInfiniteEngagementsQuery,
    useUpdateEngagemmentActivity,
} from '../../../queries/engagementActivity'
import { bodyHeavy, bodySmall } from '../../../styles/typography'
import preventDefaultOnEnter from '../../../utils/helpers/preventDefaultOnEnter'
import { FirebaseEngagement } from '../../../utils/types/firebase'
import EndOfNotificationsMessage from './EndOfNotificationsMessage'
import { NotificationBlock } from './NotificationBlock'
import {
    GenerateNotificationLoaders,
    NotificationLoader,
} from './NotificationLoaders'
import { NotificationMenuStyles } from './NotificationStyles'

interface NotificationMenuProps {
    close?: (
        focusableElement?:
            | HTMLElement
            | React.MutableRefObject<HTMLElement | null>
            | undefined
    ) => void
}

export const NotificationMenu: FC<NotificationMenuProps> = ({ close }) => {
    const userProfile = useAppSelector(state => state.userSlice.user)

    // Instantiate infinite notifications query
    const [filterIsNew, setFilterIsNew] = useState<boolean | undefined>(true)
    const { status, data, isFetchingNextPage, fetchNextPage, hasNextPage } =
        useInfiniteEngagementsQuery(userProfile.uid, filterIsNew)

    // Notification mutation hook
    const engagementMutation = useUpdateEngagemmentActivity(userProfile.uid)

    // Instantiate intersection observer
    const loadMoreRef = useRef<HTMLDivElement>(null)
    useIntersectionObserver({
        threshold: 0.5,
        target: loadMoreRef,
        onIntersect: fetchNextPage,
        enabled: !!hasNextPage,
    })

    // Handler functions
    const toggleShowOldNotifications = () => {
        setFilterIsNew(filterIsNew ? undefined : true)
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

    const markAllAsRead = () => {
        if (!data) return
        // Iterate through all the notifications and send PATCH update
        // to API to change status isNew to false if it hasn't been read
        // by user
        data.pages.forEach(
            page =>
                page.engagements?.length > 0 &&
                page.engagements.forEach((engagement: FirebaseEngagement) => {
                    // If engagement is new, update status
                    if (engagement.isNew) updateHandler(engagement.id)
                })
        )
    }

    return (
        <div className={NotificationMenuStyles.body}>
            <div className={NotificationMenuStyles.header}>
                <span className={bodyHeavy}>Notifications</span>
                <span
                    onClick={markAllAsRead}
                    className={
                        bodySmall +
                        'text-primary dark:text-primaryDark self-end ml-auto cursor-pointer'
                    }
                >
                    Mark All As Read
                </span>
            </div>
            {/* <div className="flex items-center my-5 space-x-2">
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
            </div> */}
            <div className={NotificationMenuStyles.main}>
                {status === 'loading' ? (
                    <GenerateNotificationLoaders n={3} />
                ) : status === 'error' ? (
                    // TODO: need nicer error component
                    <div>Error loading notifications.</div>
                ) : (
                    <>
                        {/* Infinite scroller / lazy loader */}
                        {data?.pages.map(page => (
                            <Fragment key={page?.lastTimestamp?.seconds}>
                                {/* If notifications exist */}
                                {page.engagements?.length > 0 &&
                                    page.engagements.map(
                                        (engagement: FirebaseEngagement) => (
                                            <NotificationBlock
                                                key={engagement.id}
                                                engagementId={engagement.id}
                                                timestamp={engagement.timestamp}
                                                action={engagement.action}
                                                engagerId={engagement.engagerId}
                                                targetId={engagement.targetId}
                                                targetObject={
                                                    engagement.targetObject
                                                }
                                                targetRoute={
                                                    engagement.targetRoute
                                                }
                                                isNew={engagement.isNew}
                                                close={close}
                                            />
                                        )
                                    )}
                            </Fragment>
                        ))}

                        {/* Lazy loader sentinel and end of notifications */}
                        {isFetchingNextPage || hasNextPage ? (
                            <NotificationLoader ref={loadMoreRef} />
                        ) : data?.pages[0].engagements &&
                          data?.pages[0].engagements.length === 0 ? (
                            // Add EndOfNotificationsMessage here
                            <EndOfNotificationsMessage
                                message={'No New Notifications!'}
                            />
                        ) : (
                            <></>
                        )}
                    </>
                )}
            </div>
            <div className={NotificationMenuStyles.footer}>
                <div className={NotificationMenuStyles.toggleOld}>
                    <input
                        type="checkbox"
                        className={NotificationMenuStyles.checkbox}
                        checked={!filterIsNew}
                        onChange={toggleShowOldNotifications}
                        onKeyPress={preventDefaultOnEnter}
                    />
                    <span
                        className={
                            bodySmall +
                            'text-neutral-700 dark:text-neutralDark-150'
                        }
                    >
                        Show old notifications
                    </span>
                </div>
                {/* <UilTrashAlt className={'self-end ml-auto'} /> */}
            </div>
        </div>
    )
}
