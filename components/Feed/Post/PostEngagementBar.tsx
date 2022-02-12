import React, { FC } from 'react'
import { postCardClass } from '../../../styles/feed'
import Button from '../../Utils/Button'
import { useRouter } from 'next/router'
import { UilComment, UilThumbsUp } from '@iconscout/react-unicons'
import { EngagementItems } from '../../../utils/types/global'
import { usePostNumberLikes } from '../../../hooks/useNumberLikes'
import { useUser } from '@auth0/nextjs-auth0'
import { userProfileState } from '../../../atoms/user'
import { useRecoilValue } from 'recoil'
import { usePostNumberComments } from '../../../hooks/useNumberComments'
import { getPost } from '../../../lib/postsHelper'
import { addLike } from '../../../lib/getLikesHelper'

type PostEngagementBarProps = {
    id: string
}

const PostEngagementBar: FC<PostEngagementBarProps> = ({ id }) => {
    const { user } = useUser()
    const userProfile = useRecoilValue(userProfileState)

    // Track number of likes and comments
    const [numLikes] = usePostNumberLikes(id)
    const [numComments] = usePostNumberComments(id)

    // Use the router to redirect the user to the comments page
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
                        (!user && idx === 1 ? ' cursor-default' : '')
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
