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

import { db } from '../../../firebase'
import { useProfileData } from '../../../hooks/useProfileData'
import { getAuthorName, getProfilePic } from '../../../lib/profileHelper'
import { deleteMedia } from '../../../lib/storageHelper'
import { postCardClass } from '../../../styles/feed'
import { FirebaseProfile } from '../../../utils/types/firebase'
import { staticPostData } from '../../../utils/types/params'
import bull from '../../Utils/Bullet'
import { Avatar } from '../../Utils/common/Avatar'
import Timestamp from '../../Utils/Timestamp'
import PostOptionsDropdown from './PostOptionsDropdown'

type PostHeaderProps = {
    id: string
    authorUid: string
    name: string
    numComments: number
    feed: string | undefined
    timestamp: FieldValue
    isAnonymous: boolean
}

const PostHeader: FC<PostHeaderProps> = ({
    id,
    authorUid,
    numComments,
    feed,
    timestamp,
    isAnonymous,
}) => {
    // Listen to real time author profile data
    const [authorProfile] = useProfileData(authorUid)

    // router from next.js to use location functions.
    const router = useRouter()

    // Track mobile state
    const isMobile = useMediaQuery('(max-width: 965px)')

    // Create params
    const staticPostData: staticPostData = {
        id: id,
        authorUid: authorUid,
        isAnonymous: isAnonymous,
    }

    // Delete the post entry from the DB.
    // Note: this post should NOT have any comments
    const deletePostEntry = async () => {
        const postDocRef = doc(db, 'posts', id)
        await deleteDoc(postDocRef).catch(err => {
            console.log('Cannot delete post: ', err)
        })

        // Delete the post's media, if any
        deleteMedia(`posts/${id}`)
    }

    // Deletes a post
    const deletePost = async () => {
        const activitiesQuery = query(
            collection(db, 'post-activity'),
            where('postId', '==', id)
        )

        getDocs(activitiesQuery)
            .then(async sub => {
                sub.forEach(activity => {
                    deleteDoc(activity?.ref).catch(err => {
                        console.log('Cannot delete activity: ', err)
                    })
                })
                deletePostEntry()
            })
            .catch(err => {
                console.log('Cannot delete activities: ', err)
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
    // TODO : Generalize getAvatar function to use it for comments and replies too
    const getAvatar = (
        authorProfile: FirebaseProfile | undefined,
        parentPost: staticPostData
    ) => {
        if (parentPost.isAnonymous) {
            return (
                <Avatar
                    className={postCardClass.avatar}
                    src={getProfilePic(authorProfile, parentPost) || ''}
                />
            )
        }
        return (
            <Avatar
                onClick={handleProfileAvatarClick}
                className={postCardClass.avatar}
                src={getProfilePic(authorProfile, parentPost) || ''}
            />
        )
    }
    return (
        <div className={postCardClass.header}>
            {/* Left content */}
            <div className={postCardClass.headerLeft}>
                {/* Avatar */}
                {getAvatar(authorProfile, staticPostData)}

                {/* Split into two rows on mobile */}
                <div className={postCardClass.infoDiv}>
                    <div className={postCardClass.leftMobileRowOne}>
                        {/* User Name */}
                        <span className="pl-sm font-bold">
                            {getAuthorName(authorProfile, staticPostData)}
                        </span>
                    </div>
                    <div className={postCardClass.leftMobileRowTwo}>
                        {/* Number of answers */}
                        {!isMobile && <p>{`${numComments} Comments`}</p>}
                        {!isMobile && bull}
                        {/* Post category */}
                        {feed && (
                            <p className={postCardClass.categoryP}>{feed}</p>
                        )}
                        {feed && bull}
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
                    deletePost={deletePost}
                    postType="Post"
                />
            </div>
        </div>
    )
}

export default PostHeader
