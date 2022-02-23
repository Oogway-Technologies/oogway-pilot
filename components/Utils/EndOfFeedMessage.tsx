import React, { FC } from 'react'
import { endOfFeedMessageClass } from '../../styles/feed'

type EndOfFeedProps = {
    topMessage?: string
    bottomMessage?: string
}

const EndOfFeedMessage: FC<EndOfFeedProps> = ({
    topMessage = "You've read it all...",
    bottomMessage='Now share your wisdom!',
}) => {
    return (
        <div className={endOfFeedMessageClass.outerDiv}>
            <div className={endOfFeedMessageClass.topMessage}>{topMessage}</div>
            {bottomMessage && (
                <div className={endOfFeedMessageClass.bottomMessage}>
                    {bottomMessage}
                </div>
            )}
        </div>
    )
}

export default EndOfFeedMessage
