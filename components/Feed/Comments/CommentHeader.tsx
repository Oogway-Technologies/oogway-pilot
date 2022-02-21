import Timestamp from '../../Utils/Timestamp'
import React, {FC} from 'react'
import needsHook from '../../../hooks/needsHook'
import {postCardClass} from '../../../styles/feed'
import PostOptionsDropdown from '../Post/PostOptionsDropdown'
import {db} from '../../../firebase'
import {Avatar} from '@mui/material'
// @ts-ignore
import {UilCornerUpLeftAlt} from '@iconscout/react-unicons'

import { useProfileData } from '../../../hooks/useProfileData'
import { collection, where, query, deleteDoc, doc, getDocs, updateDoc, FieldValue} from 'firebase/firestore'
import { getUserDoc } from '../../../lib/userHelper'
import { getComment } from '../../../lib/commentsHelper'
import { getRepliesCollection } from '../../../lib/repliesHelper'
import { deleteMedia } from '../../../lib/storageHelper'

type CommentHeaderProps = {
    postId: string
    commentId: string
    authorUid: string
    name: string
    timestamp: FieldValue
}

const CommentHeader: FC<CommentHeaderProps> = ({
    postId,
    commentId,
    name,
    authorUid,
    timestamp,
}) => {
    // Listen to real time author profile data
    const [authorProfile] = useProfileData(authorUid)

    // Deletes a post
    const deleteCommentEntry = async () => {
        const commentDocRef = doc(db, 'post-activity', commentId)
        await deleteDoc(commentDocRef).catch((err) => {
            console.log('Cannot delete coment: ', err)
        })

        // Delete the comment's media, if any
        deleteMedia(`posts/${commentId}`)
    }

    // Deletes a comment
    const deleteComment = async () => {
        let repliesQuery = query( 
                        collection(db, "post-activity"), 
                        where("parentId", '==', commentId)
                    )
        
        getDocs(repliesQuery).then(async (sub) => {
            sub.forEach((reply) => {
                deleteDoc(reply?.ref).catch((err) => {
                    console.log('Cannot delete reply: ', err)
                })
            })
            deleteCommentEntry()
        })
        .catch((err) => {
            console.log('Cannot delete replies: ', err)
        })
        return `/comments/${postId}`
    }

    return (
        <div className={postCardClass.header}>
            {/* Left content */}
            <div className={postCardClass.headerLeft}>
                {/* Avatar */}
                <Avatar
                    onClick={needsHook}
                    className={postCardClass.avatar}
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
                                ? authorProfile.username
                                : name}
                        </span>
                    </div>

                    <div className={postCardClass.leftMobileRowTwo}>
                        {/* Time stamp */}
                        {/* {bull} */}
                        <Timestamp timestamp={timestamp} />
                    </div>
                </div>
            </div>

            {/* Right: More Button */}
            <div className={postCardClass.headerRight}>
                <PostOptionsDropdown
                    authorUid={authorUid}
                    authorName={
                        authorProfile?.username ? authorProfile.username : name
                    }
                    deletePost={deleteComment}
                />
            </div>
        </div>
    )
}

export default CommentHeader
