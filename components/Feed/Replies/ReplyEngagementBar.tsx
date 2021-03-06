import { useUser } from '@auth0/nextjs-auth0'
import { UilThumbsUp } from '@iconscout/react-unicons'
import React from 'react'

import { useReplyNumberLikes } from '../../../hooks/useNumberLikes'
import { useAppSelector } from '../../../hooks/useRedux'
import { useUserHasLiked } from '../../../hooks/useUserHasLiked'
import { addLike } from '../../../lib/getLikesHelper'
import { getReply } from '../../../lib/repliesHelper'
import { useCreateEngagemmentActivity } from '../../../queries/engagementActivity'
import {
    commentEngagementBarClass,
    replyEngagementBarClass,
} from '../../../styles/feed'
import { FirebaseEngagement } from '../../../utils/types/firebase'
import { EngagementItems } from '../../../utils/types/global'
import Button from '../../Utils/Button'

type ReplyEngagementBarProps = {
    postId: string
    commentId: string
    replyId: string
    authorUid: string
}

const ReplyEngagementBar: React.FC<
    React.PropsWithChildren<React.PropsWithChildren<ReplyEngagementBarProps>>
> = ({ postId, commentId, replyId, authorUid }) => {
    const { user } = useUser()
    const userProfile = useAppSelector(state => state.userSlice.user)

    // Track likes
    const [userHasLiked] = useUserHasLiked(
        `post-activity/${replyId}`,
        userProfile.uid
    )
    const [numLikes] = useReplyNumberLikes(postId, commentId, replyId)
    const engagementMutation = useCreateEngagemmentActivity(authorUid)

    // Handler functions
    const likeHandler = async () => {
        // return early if redux failed to fetch user
        if (!userProfile.uid) return

        // Add like
        addLike(user, userProfile, getReply(replyId))

        // Create engagement record for notifications
        const engagement: FirebaseEngagement = {
            engagerId: userProfile.uid,
            engageeId: authorUid,
            action: 'like',
            targetId: replyId,
            targetObject: 'Reply',
            targetRoute: `comments/${postId}`,
            isNew: true,
        }
        engagementMutation.mutate(engagement)
    }

    // Items
    const engagementItems: EngagementItems[] = [
        {
            icon: <UilThumbsUp />,
            text: `${
                numLikes === 1 ? `${numLikes} Like` : `${numLikes} Likes`
            }`,
            onClick: likeHandler,
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
