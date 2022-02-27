import Timestamp from '../../Utils/Timestamp'
import React from 'react'
import needsHook from '../../../hooks/needsHook'
import {postCardClass, replyHeaderClass} from '../../../styles/feed'
import PostOptionsDropdown from '../Post/PostOptionsDropdown'
import {db} from '../../../firebase'
import {Avatar} from '@mui/material'
import {deleteDoc, doc} from 'firebase/firestore'
import {useProfileData} from '../../../hooks/useProfileData'

type ReplyHeaderProps = {
    postId: string
    commentId: string
    replyId: string
    authorUid: string
    name: string
    email: string
    timestamp: Date | null
}

const ReplyHeader: React.FC<ReplyHeaderProps> = ({
    postId,
    commentId,
    replyId,
    name,
    authorUid,
    email,
    timestamp,
}) => {
    // Get author profile
    const [authorProfile] = useProfileData(authorUid)

    // Deletes a reply
    const deleteReplyEntry = async () => {
        const replyDocRef = doc(
            db,
            `post-activity/${replyId}`
        )
        await deleteDoc(replyDocRef).catch((err) => {
            console.log('Cannot delete reply: ', err)
        })

        // Return where the user should be routed
        return `/comments/${postId}`
    }

    return (
        <div className={postCardClass.header}>
            {/* Left content */}
            <div className={postCardClass.headerLeft}>
                {/* Avatar */}
                <Avatar
                    onClick={needsHook}
                    className={replyHeaderClass.avatar}
                    src={
                        authorProfile?.profilePic
                            ? authorProfile.profilePic
                            : undefined
                    }
                />

                {/* Split into two rows on mobile */}
                <div className={postCardClass.infoDiv}>
                    <div className={postCardClass.leftMobileRowOne}>
                        {/* User Name */}
                        <span className="pl-sm font-bold">
                            {authorProfile?.username
                                ? authorProfile?.username
                                : name}
                        </span>
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
                    authorName={
                        authorProfile?.username ? authorProfile?.username : name
                    }
                    deletePost={deleteReplyEntry}
                />
            </div>
        </div>
    )
}

export default ReplyHeader
