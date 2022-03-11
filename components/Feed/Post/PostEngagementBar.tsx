import React, { FC } from 'react'
import { postCardClass } from '../../../styles/feed'
import Button from '../../Utils/Button'
import { useRouter } from 'next/router'
// @ts-ignore
import { UilComment, UilThumbsUp } from '@iconscout/react-unicons'
import { EngagementItems } from '../../../utils/types/global'
import { usePostNumberLikes } from '../../../hooks/useNumberLikes'
import { useUser } from '@auth0/nextjs-auth0'
import { userProfileState } from '../../../atoms/user'
import { useRecoilValue } from 'recoil'
import { usePostNumberComments } from '../../../hooks/useNumberComments'
import { getPost } from '../../../lib/postsHelper'
import { addLike } from '../../../lib/getLikesHelper'
import { useUserHasLiked } from '../../../hooks/useUserHasLiked'
import { useOnCommmentsPage } from '../../../hooks/useOnCommentsPage'

type PostEngagementBarProps = {
    id: string
}

const PostEngagementBar: FC<PostEngagementBarProps> = ({ id }) => {
    const { user } = useUser()
    const userProfile = useRecoilValue(userProfileState)

    // Track likes and comments
    const [userHasLiked] = useUserHasLiked(`posts/${id}`, userProfile.uid)
    const [numLikes] = usePostNumberLikes(id)
    const [numComments] = usePostNumberComments(id)

    // Use the router to redirect the user to the comments page
    // and track whether on comments paage
    const [onCommentsPage] = useOnCommmentsPage(id)
    const router = useRouter()

    // Hooks
    const enterComments = () => {
        router.push(`/comments/${id}`)
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
            onClick: () => addLike(user, userProfile, getPost(id)),
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
