import { useUser } from '@auth0/nextjs-auth0'
import { UilComment, UilThumbsUp } from '@iconscout/react-unicons'
import { useRouter } from 'next/router'
import React, { FC } from 'react'

import { setJumpToComment } from '../../../features/utils/utilsSlice'
import { usePostNumberLikes } from '../../../hooks/useNumberLikes'
import { useOnCommmentsPage } from '../../../hooks/useOnCommentsPage'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { useUserHasLiked } from '../../../hooks/useUserHasLiked'
import { addLike } from '../../../lib/getLikesHelper'
import { getPost } from '../../../lib/postsHelper'
import { useCreateEngagemmentActivity } from '../../../queries/engagementActivity'
import { postCardClass } from '../../../styles/feed'
import { FirebaseEngagement } from '../../../utils/types/firebase'
import { EngagementItems } from '../../../utils/types/global'
import Button from '../../Utils/Button'

type PostEngagementBarProps = {
    id: string
    authorUid: string
    numComments: number
}

const PostEngagementBar: FC<PostEngagementBarProps> = ({
    id,
    authorUid,
    numComments,
}) => {
    const { user } = useUser()
    const userProfile = useAppSelector(state => state.userSlice.user)

    // Track likes and comments
    const [userHasLiked] = useUserHasLiked(`posts/${id}`, userProfile.uid)
    const [numLikes] = usePostNumberLikes(id)
    const engagementMutation = useCreateEngagemmentActivity(authorUid)

    // Use the router to redirect the user to the comments page
    // and track whether on comments paage
    const [onCommentsPage] = useOnCommmentsPage(id)
    const router = useRouter()

    // Handler functions
    const enterComments = () => {
        useAppDispatch(setJumpToComment(`post-${id}`))
        router.push(`/comments/${id}`)
    }

    const likeHandler = async () => {
        // Add like
        addLike(user, userProfile, getPost(id))

        // Create engagement record for notifications
        const engagement: FirebaseEngagement = {
            engagerId: userProfile.uid,
            engageeId: authorUid,
            action: 'like',
            targetId: id,
            targetObject: 'Post',
            targetRoute: `comments/${id}`,
            isNew: true,
        }
        engagementMutation.mutate(engagement)
    }

    // Items
    const engagementItems: EngagementItems[] = [
        {
            icon: <UilComment />,
            text: `${
                numComments === 1
                    ? `${numComments} Comment`
                    : `${numComments} Comments`
            }`,
            onClick: enterComments,
        },
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
        <div className={postCardClass.engagementBar}>
            {engagementItems.map((item, idx) => (
                <Button
                    key={idx}
                    addStyle={
                        postCardClass.engagementButton +
                        (!user && idx === 1 ? ' cursor-default' : '') +
                        (idx === 1 && userHasLiked
                            ? ' text-secondary dark:text-secondaryDark font-bold'
                            : ' text-neutral-700 dark:text-neutralDark-150') +
                        (onCommentsPage && idx === 0
                            ? ' text-primary/70 dark:text-primaryDark/70 font-bold'
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

export default PostEngagementBar
