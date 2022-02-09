import React from 'react'
import needsHook from '../../../hooks/needsHook'
import { auth, db, storage } from '../../../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import PostOptionsDropdown from './PostOptionsDropdown'
import { Avatar } from '@mui/material'
import { avatarURL, postCardClass } from '../../../styles/feed'
import bull from '../../Utils/Bullet'
import Timestamp from '../../Utils/Timestamp'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { doc } from 'firebase/firestore'

type PostHeaderProps = {
    id: string
    authorUid: string
    name: string | null
    email: string
    timestamp: Date | null
}

const PostHeader = ({
    id,
    name,
    authorUid,
    email,
    timestamp,
}: PostHeaderProps) => {
    const [user] = useAuthState(auth)

    // Author profile
    const [authorProfile] = useDocumentData(doc(db, 'profiles', authorUid)) // static, should listen for updates

    const deletePostEntry = () => {
        // Delete the post entry from the DB.
        // Note: this post should NOT have any comments
        db.collection('posts')
            .doc(id)
            .delete()
            .catch((err) => {
                console.log('Cannot delete post: ', err)
            })

        // Update the user's posts list
        db.collection('users')
            .doc(user.uid)
            .get()
            .then((doc) => {
                let tmp = doc.data()
                const index = tmp.posts.indexOf(id)
                if (index > -1) {
                    tmp.posts.splice(index, 1)
                    doc.ref.update(tmp)
                }
            })

        // Delete the post's media, if any
        storage
            .ref(`posts/${id}`)
            .listAll()
            .then((listResults) => {
                const promises = listResults.items.map((item) => {
                    return item.delete()
                })
                Promise.all(promises)
            })
    }

    // Deletes a post
    const deletePost = () => {
        // Before deleting the post, we need to delete the comments.
        // Comments is a sub-collection of the post, so we need to
        // retrieve all comments and delete them first.
        db.collection('posts')
            .doc(id)
            .get()
            .then(() => {
                // Check if comments exists for this post
                db.collection('posts')
                    .doc(id)
                    .collection('comments')
                    .get()
                    .then((sub) => {
                        if (sub.docs.length > 0) {
                            // Comments are present, delete them
                            sub.forEach((com) => {
                                com.ref.delete()
                            })
                        }

                        // Proceed to delete the post
                        deletePostEntry()
                    })
                    .catch((err) => {
                        console.log('Cannot delete comments: ', err)
                    })
            })

        // Return where the user should be routed, if necesary
        return `/feed/${user.uid}`
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
                            : null
                    }
                />

                {/* Split into two rows on mobile */}
                <div className={postCardClass.infoDiv}>
                    <div className={postCardClass.leftMobileRowOne}>
                        {/* User Name */}
                        <span className="pl-sm font-bold">
                            {name ? name : email}
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
                    authorName={name ? name : email}
                    deletePost={deletePost}
                />
            </div>
        </div>
    )
}

export default PostHeader
