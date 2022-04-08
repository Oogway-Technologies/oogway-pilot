import { useUser } from '@auth0/nextjs-auth0'
import {
    UilCornerUpLeftAlt,
    UilThumbsDown,
    UilThumbsUp,
    UilUsersAlt,
} from '@iconscout/react-unicons'
import React from 'react'

import needsHook from '../../../hooks/needsHook'
import useMediaQuery from '../../../hooks/useMediaQuery'
import { useCommentNumberReplies } from '../../../hooks/useNumberComments'
import {
    useCommentNumberDislikes,
    useCommentNumberLikes,
} from '../../../hooks/useNumberLikes'
import { useAppSelector } from '../../../hooks/useRedux'
import {
    useUserHasDisliked,
    useUserHasLiked,
} from '../../../hooks/useUserHasLiked'
import { getComment } from '../../../lib/commentsHelper'
import { addDislike, addLike } from '../../../lib/getLikesHelper'
import { useCreateEngagemmentActivity } from '../../../queries/engagementActivity'
import { commentEngagementBarClass } from '../../../styles/feed'
import { adviceBotId } from '../../../utils/constants/global'
import { FirebaseEngagement } from '../../../utils/types/firebase'
import { EngagementItems } from '../../../utils/types/global'
import { staticPostData } from '../../../utils/types/params'
import Button from '../../Utils/Button'

type CommentEngagementBarProps = {
    postId: string
    commentId: string
    authorUid: string
    handleReply: React.MouseEventHandler<HTMLButtonElement>
    expanded: boolean
    parentPostData: staticPostData
}

const CommentEngagementBar = ({
    postId,
    commentId,
    authorUid,
    handleReply,
    expanded,
    parentPostData,
}: CommentEngagementBarProps) => {
    const { user } = useUser()
    const userProfile = useAppSelector(state => state.userSlice.user)

    // Track mobile
    const isMobile = useMediaQuery('(max-width: 768px)')

    // Track advice bot comment
    const isAdviceBotComment = () => authorUid === adviceBotId

    // Track likes and replies
    const [userHasLiked] = useUserHasLiked(
        `post-activity/${commentId}`,
        userProfile.uid
    )
    const [numLikes] = useCommentNumberLikes(postId, commentId)
    const [userHasDisliked] = useUserHasDisliked(
        `post-activity/${commentId}`,
        userProfile.uid
    )
    const [numDislikes] = useCommentNumberDislikes(postId, commentId)

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

    const isUsersOwnPost = (id: string) => {
        return userProfile?.uid === id
    }

    const textHandler = (
        count: number,
        singularText: string,
        pluralText: string
    ) => {
        // Handle mobile case
        if (isMobile) return `${count}`
        return count === 1
            ? `${count} ${singularText}`
            : `${count} ${pluralText}`
    }

    // Items
    const engagementItems: EngagementItems[] = [
        {
            icon: <UilCornerUpLeftAlt />,
            text: textHandler(numReplies, 'Reply', 'Replies'),
            onClick: handleReply,
        },
        {
            icon: <UilThumbsUp />,
            text: textHandler(numLikes, 'Like', 'Likes'),
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

    // Add dislike to Oogway AI bot comments
    if (isAdviceBotComment()) {
        // Insert into third place, ensuring later
        // elements remain at the end of the array
        engagementItems.splice(2, 0, {
            icon: <UilThumbsDown />,
            text: textHandler(numDislikes, 'Dislike', 'Dislikes'),
            onClick: () => addDislike(user, userProfile, getComment(commentId)),
            expanded: expanded,
        })
    }

    return (
        <div className={commentEngagementBarClass.engagementBar}>
            <span className={commentEngagementBarClass.engagementBarLeft}>
                {engagementItems.map((item, idx) => (
                    <Button
                        key={idx}
                        addStyle={
                            commentEngagementBarClass.engagementButton +
                            (!user ? ' cursor-default' : '') +
                            (idx === 1 && userHasLiked
                                ? ' text-secondary dark:text-secondaryDark font-bold'
                                : ' text-neutral-700 dark:text-neutralDark-150') +
                            (isAdviceBotComment() &&
                            idx === 2 &&
                            userHasDisliked
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
            </span>
            {/* Decision coach Button*/}
            <span>
                {isAdviceBotComment() &&
                    isUsersOwnPost(parentPostData.authorUid) && (
                        <Button
                            text="Ask Decision Coach"
                            keepText={false}
                            icon={<UilUsersAlt />}
                            type="button"
                            onClick={needsHook}
                            addStyle={
                                commentEngagementBarClass.askDecisionCoashButton
                            }
                        />
                    )}
            </span>
        </div>
    )
}

export default CommentEngagementBar
