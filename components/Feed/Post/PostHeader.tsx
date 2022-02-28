import React, {FC} from 'react'
import PostOptionsDropdown from './PostOptionsDropdown'
import {Avatar} from '@mui/material'
import {postCardClass} from '../../../styles/feed'
import Timestamp from '../../Utils/Timestamp'
import {FieldValue} from 'firebase/firestore'
import {useProfileData} from '../../../hooks/useProfileData'
import {deleteMedia} from '../../../lib/storageHelper'
import {useRouter} from 'next/router'
import {getFunctions, httpsCallable} from 'firebase/functions'

type PostHeaderProps = {
    id: string
    authorUid: string
    name: string
    timestamp: FieldValue
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

    // Deletes a post
    const deletePost = async () => {
        // Get the path to the post to delete
        const path = `posts/${id}`

        // Get the delete function and call it on the path
        const functions = getFunctions()
        const deleteFn = httpsCallable(functions, 'recursiveDelete')
        deleteFn({ path: path }).catch(function (err) {
            console.log('Delete failed, see console,')
            console.warn(err)
        })

        // Delete the post's media, if any
        deleteMedia(`posts/${id}`)

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
                            {authorProfile?.username
                                ? authorProfile?.username
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
                    postType='Post'
                />
            </div>
        </div>
    )
}

export default PostHeader
