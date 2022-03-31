import { useUser } from '@auth0/nextjs-auth0'
import { UilCornerUpLeftAlt, UilThumbsUp } from '@iconscout/react-unicons'
import React from 'react'

import { useCommentNumberReplies } from '../../../hooks/useNumberComments'
import { useCommentNumberLikes } from '../../../hooks/useNumberLikes'
import { useAppSelector } from '../../../hooks/useRedux'
import { useUserHasLiked } from '../../../hooks/useUserHasLiked'
import { getComment } from '../../../lib/commentsHelper'
import { addLike } from '../../../lib/getLikesHelper'
import { useCreateEngagemmentActivity } from '../../../queries/engagementActivity'
import { commentEngagementBarClass } from '../../../styles/feed'
import { FirebaseEngagement } from '../../../utils/types/firebase'
import { EngagementItems } from '../../../utils/types/global'
import Button from '../../Utils/Button'

type CommentEngagementBarProps = {
    postId: string
    commentId: string
    authorUid: string
    handleReply: React.MouseEventHandler<HTMLButtonElement>
    expanded: boolean
}

const CommentEngagementBar = ({
    postId,
    commentId,
    authorUid,
    handleReply,
    expanded,
}: CommentEngagementBarProps) => {
    const { user } = useUser()
    const userProfile = useAppSelector(state => state.userSlice.user)

    // Track likes and replies
    const [userHasLiked] = useUserHasLiked(
        `post-activity/${commentId}`,
        userProfile.uid
    )
    const [numLikes] = useCommentNumberLikes(postId, commentId)
    const [numReplies] = useCommentNumberReplies(postId, commentId)
    const engagementMutation = useCreateEngagemmentActivity(authorUid)

    // Handler functions
    const likeHandler = async () => {
        // Add like
        addLike(user, userProfile, getComment(commentId))

        // Create engagement record for notifications
        const engagement: FirebaseEngagement = {
            engagerId: userProfile.uid,
            engageeId: authorUid,
            action: 'like',
            targetId: commentId,
            targetObject: 'Comment',
            targetRoute: `comments/${postId}`,
            isNew: true,
        }
        engagementMutation.mutate(engagement)
    }

    // Items
    const engagementItems: EngagementItems[] = [
        {
            icon: <UilCornerUpLeftAlt />,
            text: `${
                numReplies === 1
                    ? `${numReplies} Reply`
                    : `${numReplies} Replies`
            }`,
            onClick: handleReply,
        },
        {
            icon: <UilThumbsUp />,
            text: `${
                numLikes === 1 ? `${numLikes} Like` : `${numLikes} Likes`
            }`,
            onClick: likeHandler,
            expanded: expanded,
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
        <div className={commentEngagementBarClass.engagementBar}>
            {engagementItems.map((item, idx) => (
                <Button
                    key={idx}
                    addStyle={
                        commentEngagementBarClass.engagementButton +
                        (!user ? ' cursor-default' : '') +
                        (idx === 1 && userHasLiked
                            ? ' text-secondary dark:text-secondaryDark font-bold'
                            : ' text-neutral-700 dark:text-neutralDark-150')
                    }
                    type="button"
                    onClick={item.onClick}
                    icon={item.icon}
                    keepText={true}
                    text={item.text}
                    aria-expanded={item.expanded ? item.expanded : false}
                />
            ))}
        </div>
    )
}

export default CommentEngagementBar
