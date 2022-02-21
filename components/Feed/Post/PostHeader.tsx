import React, { FC } from 'react'
import { db } from '../../../firebase'
import PostOptionsDropdown from './PostOptionsDropdown'
import { Avatar } from '@mui/material'
import { postCardClass } from '../../../styles/feed'
import Timestamp from '../../Utils/Timestamp'
import { getUserDoc } from '../../../lib/userHelper'
import { getCommentsCollection } from '../../../lib/commentsHelper'
import { getPost } from '../../../lib/postsHelper'
import { deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { useProfileData } from '../../../hooks/useProfileData'
import { deleteMedia } from '../../../lib/storageHelper'
import { useRouter } from 'next/router'

import { app } from '../../../firebase'
import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from "firebase/functions";

type PostHeaderProps = {
    id: string
    authorUid: string
    name: string
    timestamp: Date | null
}

const PostHeader: FC<PostHeaderProps> = ({
    id,
    name,
    authorUid,
    timestamp,
}) => {
    // Listen to real time author profile data
    const [authorProfile] = useProfileData(authorUid)
    // router from next.js to use location functions.
    const router = useRouter()

    // Delete the post entry from the DB.
    // Note: this post should NOT have any comments
    const deletePostEntry = async () => {
        const postDocRef = doc(db, 'posts', id)
        await deleteDoc(postDocRef).catch((err) => {
            console.log('Cannot delete post: ', err)
        })

        // Update the user's posts list
        const authorUserDoc = getUserDoc(authorUid)
        await authorUserDoc.then(async (doc) => {
            if (doc?.exists()) {
                let tmp = doc.data()
                delete tmp.posts[id]
                await updateDoc(doc.ref, tmp)
            }
        })

        // Delete the post's media, if any
        deleteMedia(`posts/${id}`)
    }

    // Deletes a post
    const deletePost = async () => {
        const postDoc = getPost(id)


        
        console.log('------ Deleting post: ', id)
        const path = "'posts/" + id + "'"

        const functions = getFunctions(app);
        const deleteFn = httpsCallable(functions, 'recursiveDelete');
        deleteFn({ path: path })
        .then(function(result) {
            console.log('Delete success: ' + JSON.stringify(result));
        })
        .catch(function(err) {
            console.log('Delete failed, see console,');
            console.warn(err);
        });

        // Before deleting the post, we need to delete the comments.
        // Comments is a sub-collection of the post, so we need to
        // retrieve all comments and delete them first
        
        await postDoc.then(async () => {
            // Check if comments exists for this post
            const commentsCollection = getCommentsCollection(id)
            await commentsCollection
                .then(async (sub) => {
                    if (sub.docs.length > 0) {
                        // Comments are present, delete them
                        sub.forEach((com) => {
                            deleteDoc(com?.ref).then((err) => {
                                console.log('Cannot delete comment: ', err)
                            })
                        })
                    }

                    // Proceed to delete the post
                    await deletePostEntry()
                })
                .catch((err) => {
                    console.log('Cannot delete comments: ', err)
                })
        })

        // Return where the user should be routed
        // If the user deletes the parent post from
        // its comments page, they need to be routed back to
        // the main feed. Otherwise, they need to be kept
        // on their current page
        if (router.asPath === `/comments/${id}`) {
            return '/'
        } else {
            return router.asPath
        }
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
                    className={postCardClass.avatar}
                    src={authorProfile?.profilePic || undefined}
                />

                {/* Split into two rows on mobile */}
                <div className={postCardClass.infoDiv}>
                    <div className={postCardClass.leftMobileRowOne}>
                        {/* User Name */}
                        <span className="pl-sm font-bold">
                            {authorProfile.username
                                ? authorProfile.username
                                : name}
                        </span>
                    </div>
                    <div className={postCardClass.leftMobileRowTwo}>
                        {/* TODO: interpolate post category below */}
                        {/* <p className={postCardClass.categoryP}>Education</p>
                        {bull} */}
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
                    deletePost={deletePost}
                />
            </div>
        </div>
    )
}

export default PostHeader
