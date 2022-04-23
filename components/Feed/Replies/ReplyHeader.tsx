import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    where,
} from 'firebase/firestore'
import { useRouter } from 'next/router'
import React from 'react'
import { useQueryClient } from 'react-query'

import { db } from '../../../firebase'
import { useProfileData } from '../../../hooks/useProfileData'
import { getAuthorName, getProfilePic } from '../../../lib/profileHelper'
import { postCardClass } from '../../../styles/feed'
import { authorLabel } from '../../../utils/constants/global'
import { staticPostData } from '../../../utils/types/params'
import { Avatar } from '../../Utils/common/Avatar'
import Timestamp from '../../Utils/Timestamp'
import PostOptionsDropdown from '../Post/PostOptionsDropdown'

type ReplyHeaderProps = {
    postId: string
    commentId: string
    commentAuthor: string
    replyId: string
    authorUid: string
    name: string
    email: string
    timestamp: Date | null
    parentPostData: staticPostData
}

const ReplyHeader: React.FC<
    React.PropsWithChildren<React.PropsWithChildren<ReplyHeaderProps>>
> = ({
    postId,
    replyId,
    commentAuthor,
    authorUid,
    timestamp,
    parentPostData,
}) => {
    // Get author profile
    const [authorProfile] = useProfileData(authorUid)

    const router = useRouter()

    const queryClient = useQueryClient()

    // Deletes a reply
    const deleteReplyEntry = async () => {
        const replyDocRef = doc(db, `post-activity/${replyId}`)
        await deleteDoc(replyDocRef).catch(err => {
            console.log('Cannot delete reply: ', err)
        })

        // delete notifications
        deleteEngagementEntries()

        // Invalidate parent comment author's notifications
        queryClient.invalidateQueries(['engagementActivity', commentAuthor])

        // Return where the user should be routed
        return `/comments/${postId}`
    }

    const deleteEngagementEntries = async () => {
        const engagementQuery = query(
            collection(db, 'engagement-activity'),
            where('targetId', '==', replyId)
        )

        // delete engagement
        getDocs(engagementQuery).then(async snap => {
            snap.forEach(engagement => {
                deleteDoc(engagement?.ref).catch(err => {
                    console.log('Cannot delete engagement: ', err)
                })
                // invalidate engagee's notification list
                queryClient.invalidateQueries([
                    'engagementActivty',
                    engagement.data().engageeId,
                ])
            })
        })
    }

    const handleProfileAvatarClick = async (
        e: React.MouseEvent<HTMLDivElement>
    ) => {
        e.preventDefault()
        await router.push(`/profile/${authorUid}`)
    }

    return (
        <div className={postCardClass.header}>
            {/* Left content */}
            <div className={postCardClass.headerLeft}>
                {/* Avatar */}
                <Avatar
                    onClick={handleProfileAvatarClick}
                    size={'sm'}
                    src={getProfilePic(authorProfile, parentPostData) || ''}
                />

                {/* Split into two rows on mobile */}
                <div className={postCardClass.infoDiv}>
                    <div className={postCardClass.leftMobileRowOne}>
                        {/* User Name */}
                        <span className="pl-sm font-bold">
                            {getAuthorName(authorProfile, parentPostData)}
                        </span>
                        {parentPostData.authorUid == authorUid && (
                            <span className="pl-sm font-bold">
                                {authorLabel}
                            </span>
                        )}
                    </div>

                    <div className={postCardClass.leftMobileRowTwo}>
                        {/* Time stamp */}
                        <Timestamp timestamp={timestamp} />
                    </div>
                </div>
            </div>

            {/* Right: More Button */}
            <div className={postCardClass.headerRight}>
                <PostOptionsDropdown
                    authorUid={authorUid}
                    authorProfile={authorProfile}
                    deletePost={deleteReplyEntry}
                    postType="Reply"
                />
            </div>
        </div>
    )
}

export default ReplyHeader
