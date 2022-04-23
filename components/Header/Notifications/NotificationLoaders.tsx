/* eslint-disable react/display-name */
import React, { FC, forwardRef } from 'react'
import ContentLoader from 'react-content-loader'

import { NotificationBlockStyles } from './NotificationStyles'

export const NotificationContent: FC<
    React.PropsWithChildren<React.PropsWithChildren<unknown>>
> = props => (
    <ContentLoader
        speed={2}
        width={240}
        height={50}
        viewBox="0 0 240 50"
        backgroundColor="#B0B3B8"
        foregroundColor="#7269FF"
        {...props}
    >
        <rect x="9" y="8" rx="3" ry="3" width="209" height="12" />
        <rect x="0" y="71" rx="3" ry="3" width="37" height="11" />
        <rect x="8" y="31" rx="3" ry="3" width="102" height="12" />
        <rect x="133" y="31" rx="3" ry="3" width="86" height="12" />
    </ContentLoader>
)

export const NotificationLoader = forwardRef(
    (props, ref: React.Ref<HTMLDivElement>) => (
        <div className={NotificationBlockStyles.body} ref={ref}>
            <NotificationContent />
        </div>
    )
)

interface GenerateNotificationLoaderProps {
    n: number // number of place holder cards to generate
}

export const GenerateNotificationLoaders: FC<
    React.PropsWithChildren<
        React.PropsWithChildren<GenerateNotificationLoaderProps>
    >
> = ({ n }) => {
    // Create array to iterate over
    const nNotifications = new Array<number>(n)

    return (
        <>
            {nNotifications.map(i => (
                <NotificationLoader key={i} />
            ))}
        </>
    )
}
