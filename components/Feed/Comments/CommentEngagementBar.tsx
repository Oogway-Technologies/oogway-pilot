import React from 'react'
import { commentEngagementBarClass } from '../../../styles/feed'
import Button from '../../Utils/Button'
import { UilCornerUpLeftAlt, UilThumbsUp } from '@iconscout/react-unicons'
import { EngagementItems } from '../../../utils/types/global'
import { addLike } from '../../../lib/getLikesHelper'
import { useCommentNumberLikes } from '../../../hooks/useNumberLikes'
import { useCommentNumberReplies } from '../../../hooks/useNumberComments'
import { useUser } from '@auth0/nextjs-auth0'
import { useRecoilValue } from 'recoil'
import { userProfileState } from '../../../atoms/user'
import { getComment } from '../../../lib/commentsHelper'

type CommentEngagementBarProps = {
    postId: string
    commentId: string
    handleReply: React.MouseEventHandler<HTMLButtonElement>
    expanded: boolean
}

const CommentEngagementBar = ({
    postId,
    commentId,
    handleReply,
    expanded,
}: CommentEngagementBarProps) => {
    const { user } = useUser()
    const userProfile = useRecoilValue(userProfileState)

    // Track number of likes and Comments
    const [numLikes] = useCommentNumberLikes(postId, commentId)
    const [numReplies] = useCommentNumberReplies(postId, commentId)

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
            onClick: () => {
                if (!user) return null // TODO: add popover about logging in
                addLike(user, userProfile, getComment(postId, commentId))
            },
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
                        (!user ? ' cursor-default' : '')
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
