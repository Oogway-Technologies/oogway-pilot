import React from 'react'
import {
    commentEngagementBarClass,
    replyEngagementBarClass,
} from '../../../styles/feed'
import Button from '../../Utils/Button'
import { UilThumbsUp } from '@iconscout/react-unicons'
import { EngagementItems } from '../../../utils/types/global'
import { addLike } from '../../../lib/getLikesHelper'
import { useUser } from '@auth0/nextjs-auth0'
import { useRecoilValue } from 'recoil'
import { userProfileState } from '../../../atoms/user'
import { useReplyNumberLikes } from '../../../hooks/useNumberLikes'
import { getReply } from '../../../lib/repliesHelper'

type ReplyEngagementBarProps = {
    postId: string
    commentId: string
    replyId: string
}

const ReplyEngagementBar: React.FC<ReplyEngagementBarProps> = ({
    postId,
    commentId,
    replyId,
}) => {
    const { user } = useUser()
    const userProfile = useRecoilValue(userProfileState)

    // Track number of likes
    const [numLikes] = useReplyNumberLikes(postId, commentId, replyId)

    // Items
    const engagementItems: EngagementItems[] = [
        {
            icon: <UilThumbsUp />,
            text: `${
                numLikes === 1 ? `${numLikes} Like` : `${numLikes} Likes`
            }`,
            onClick: () => {
                if (!user) return null // TODO: add popover about logging in
                addLike(user, userProfile, getReply(postId, commentId, replyId))
            },
        },
        // {
        //     icon: <UilUpload/>,
        //     text: 'Share',
        //     onClick: needsHook
        // },
        // {
        //     icon: <UilBookmark/>,
        //     text: 'Save',
        //     onClick: needsHook
        // },
    ]

    return (
        <div className={replyEngagementBarClass.engagementBar}>
            {engagementItems.map((item, idx) => (
                <Button
                    key={idx}
                    addStyle={
                        commentEngagementBarClass.engagementButton +
                        (!user ? ' cursor-default' : '')
                    }
                    type="button"
                    onClick={item.onClick}
                    icon={item.icon}
                    keepText={true}
                    text={item.text}
                />
            ))}
        </div>
    )
}

export default ReplyEngagementBar
