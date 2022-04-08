import {
    collection,
    deleteDoc,
    doc,
    FieldValue,
    getDocs,
    query,
    where,
} from 'firebase/firestore'
import { useRouter } from 'next/router'
import React, { FC } from 'react'

import { useProfileData } from '../../../hooks/useProfileData'
import { getAuthorName, getProfilePic } from '../../../lib/profileHelper'
import { deleteMedia } from '../../../lib/storageHelper'
import { db } from '../../../services/firebase'
import { postCardClass } from '../../../styles/feed'
import { authorLabel } from '../../../utils/constants/global'
import { staticPostData } from '../../../utils/types/params'
import { Avatar } from '../../Utils/common/Avatar'
import Timestamp from '../../Utils/Timestamp'
import PostOptionsDropdown from '../Post/PostOptionsDropdown'

type CommentHeaderProps = {
    postId: string
    commentId: string
    authorUid: string
    name: string
    timestamp: FieldValue
    parentPostData: staticPostData
}

const CommentHeader: FC<CommentHeaderProps> = ({
    postId,
    commentId,
    authorUid,
    timestamp,
    parentPostData,
}) => {
    // Listen to real time author profile data
    const [authorProfile] = useProfileData(authorUid)

    const router = useRouter()

    // Deletes a post
    const deleteCommentEntry = async () => {
        const commentDocRef = doc(db, 'post-activity', commentId)
        await deleteDoc(commentDocRef).catch(err => {
            console.log('Cannot delete coment: ', err)
        })

        // Delete the comment's media, if any
        deleteMedia(`posts/${commentId}`)
    }

    // Deletes a comment
    const deleteComment = async () => {
        const repliesQuery = query(
            collection(db, 'post-activity'),
            where('parentId', '==', commentId)
        )

        getDocs(repliesQuery)
            .then(async sub => {
                sub.forEach(reply => {
                    deleteDoc(reply?.ref).catch(err => {
                        console.log('Cannot delete reply: ', err)
                    })
                })
                deleteCommentEntry()
            })
            .catch(err => {
                console.log('Cannot delete replies: ', err)
            })
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
                        {/* {bull} */}
                        <Timestamp timestamp={timestamp} />
                    </div>
                </div>
            </div>

            {/* Right: More Button */}
            <div className={postCardClass.headerRight}>
                {/* TODO: Refactor params, pass the whole authorProfile ? */}
                <PostOptionsDropdown
                    authorUid={authorUid}
                    authorProfile={authorProfile}
                    deletePost={deleteComment}
                    postType="Comment"
                />
            </div>
        </div>
    )
}

export default CommentHeader
