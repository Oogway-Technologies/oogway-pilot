import { useUser } from '@auth0/nextjs-auth0'
import { UilThumbsUp } from '@iconscout/react-unicons'
import React from 'react'
import { useRecoilValue } from 'recoil'

import { userProfileState } from '../../../atoms/user'
import { useReplyNumberLikes } from '../../../hooks/useNumberLikes'
import { useUserHasLiked } from '../../../hooks/useUserHasLiked'
import { addLike } from '../../../lib/getLikesHelper'
import { getReply } from '../../../lib/repliesHelper'
import {
    commentEngagementBarClass,
    replyEngagementBarClass,
} from '../../../styles/feed'
import { EngagementItems } from '../../../utils/types/global'
import Button from '../../Utils/Button'

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

    // Track likes
    const [userHasLiked] = useUserHasLiked(
        `post-activity/${replyId}`,
        userProfile.uid
    )
    const [numLikes] = useReplyNumberLikes(postId, commentId, replyId)

    // Items
    const engagementItems: EngagementItems[] = [
        {
            icon: <UilThumbsUp />,
            text: `${
                numLikes === 1 ? `${numLikes} Like` : `${numLikes} Likes`
            }`,
            onClick: (): null | void => {
                if (!user) return null // TODO: add popover about logging in
                addLike(user, userProfile, getReply(postId))
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
                        (!user ? ' cursor-default' : '') +
                        (idx === 0 && userHasLiked
                            ? ' text-secondary dark:text-secondaryDark font-bold'
                            : ' text-neutral-700 dark:text-neutralDark-150')
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
