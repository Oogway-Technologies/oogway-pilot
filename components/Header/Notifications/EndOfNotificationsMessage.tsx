import React, { FC } from 'react'

type EndOfNotificationsProps = {
    message?: string
}

const EndOfNotificationsMessage: FC<
    React.PropsWithChildren<React.PropsWithChildren<EndOfNotificationsProps>>
> = ({ message = "You've read it all..." }) => (
    <div className="mx-auto font-bold text-neutral-700 dark:text-neutralDark-50">
        {message}
    </div>
)

export default EndOfNotificationsMessage
