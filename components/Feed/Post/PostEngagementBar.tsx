import React from 'react'
import { postCardClass } from '../../../styles/feed'
import Button from '../../Utils/Button'
import { useRouter } from 'next/router'
import { UilComment, UilThumbsUp } from '@iconscout/react-unicons'
import { db } from '../../../firebase'
import { EngagementItems } from '../../../utils/types/global'
import { usePostNumberLikes } from '../../../hooks/useNumberLikes'
import { useUser } from '@auth0/nextjs-auth0'
import { userProfileState } from '../../../atoms/user'
import { useRecoilValue } from 'recoil'
import { usePostNumberComments } from '../../../hooks/useNumberComments'
import { getPost } from '../../../lib/postsHelper'
import { updateDoc } from 'firebase/firestore'

type PostEngagementBarProps = {
    id: string
}

const PostEngagementBar = ({ id }: PostEngagementBarProps) => {
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

    const addLike = (e) => {
        // Return early for unathenticated users
        // TODO: trigger a popover that tells users they must be
        // logged in to engage and point them to registration?
        if (!user) {
            return
        }

        // Add like
        const postDoc = getPost(id)
        postDoc.then((doc) => {
            // Here goes the logic for toggling likes from each user
            if (doc.exists) {
                // Get a reference to the comment
                let tmp = doc.data()

                // Step 1: check if user.uid is in the list
                if (userProfile.uid in tmp.likes) {
                    // Negate what the user previously did
                    tmp.likes[userProfile.uid] = !tmp.likes[userProfile.uid]
                } else {
                    // The user liked the comment
                    tmp.likes[userProfile.uid] = true
                }

                // Update comment.
                // Note: a simple update here is fine.
                // No need for a transaction, since even if a like is lost,
                // That event is very rare and probably not so much of a pain
                updateDoc(doc.ref, tmp)
            } else {
                console.log('Error post not found: ' + id)
            }
        })
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
            onClick: addLike,
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
                    addStyle={postCardClass.engagementButton + ((!user && idx === 1) ? ' cursor-default' : '')}
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
