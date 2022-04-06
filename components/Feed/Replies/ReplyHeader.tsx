import { deleteDoc, doc } from 'firebase/firestore'
import { useRouter } from 'next/router'
import React from 'react'

import { useProfileData } from '../../../hooks/useProfileData'
import { getAuthorName, getProfilePic } from '../../../lib/profileHelper'
import { db } from '../../../services/firebase'
import { postCardClass } from '../../../styles/feed'
import { authorLabel } from '../../../utils/constants/global'
import { staticPostData } from '../../../utils/types/params'
import { Avatar } from '../../Utils/common/Avatar'
import Timestamp from '../../Utils/Timestamp'
import PostOptionsDropdown from '../Post/PostOptionsDropdown'
type ReplyHeaderProps = {
    postId: string
    commentId: string
    replyId: string
    authorUid: string
    name: string
    email: string
    timestamp: Date | null
    parentPostData: staticPostData
}

const ReplyHeader: React.FC<ReplyHeaderProps> = ({
    postId,
    replyId,
    authorUid,
    timestamp,
    parentPostData,
}) => {
    // Get author profile
    const [authorProfile] = useProfileData(authorUid)

    const router = useRouter()

    // Deletes a reply
    const deleteReplyEntry = async () => {
        const replyDocRef = doc(db, `post-activity/${replyId}`)
        await deleteDoc(replyDocRef).catch(err => {
            console.log('Cannot delete reply: ', err)
        })

        // Return where the user should be routed
        return `/comments/${postId}`
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
