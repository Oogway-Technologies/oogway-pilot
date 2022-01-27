import React from 'react';
import needsHook from '../../../hooks/needsHook';
import { auth, db } from '../../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import PostOptionsDropdown from './PostOptionsDropdown';
import { Avatar } from '@mui/material';
import { postCardClass, avatarURL } from '../../../styles/feed';
import bull from '../../Utils/Bullet';
import Timestamp from '../../Utils/Timestamp';
import { useCollection } from 'react-firebase-hooks/firestore';

type PostHeaderProps = {
    id: string,
    authorUid: string,
    userImage: string | null,
    name: string | null,
    email: string,
    timestamp: Date | null
};

const PostHeader = ({id, userImage, name, authorUid, email, timestamp}: PostHeaderProps) => {
    const [user] = useAuthState(auth);

    // Track number of comments
    const [commentsSnapshot] = useCollection(
        db.collection("posts").doc(id).collection("comments")
    );
    
    // Deletes a post
    const deletePost = () => {
        db.collection("posts")
        .doc(id)
        .delete()
        .catch((err) => { console.log("Cannot delete post: ", err) });

        // Update the user's posts list
        db.collection("users")
        .doc(user.uid)
        .get()
        .then((doc) => {
            let tmp = doc.data();
            const index = tmp.posts.indexOf(id);
            if (index > -1) {
                tmp.posts.splice(index, 1);
                doc.ref.update(tmp);
            }
        })

        return true
    }

    return (
        <div className={postCardClass.header}>
            {/* Left content */}
            <div className={postCardClass.headerLeft}>
                {/* Avatar */}
                <Avatar
                        onClick={needsHook}
                        className="h-[45px] w-[45px]" 
                        src={userImage ? userImage : avatarURL} 
                    />

                {/* Split into two rows on mobile */}
                <div className="flex flex-wrap">
                    <div className={postCardClass.leftMobileRowOne}>
                        {/* User Name */}
                        <span className="pl-sm">{name ? name : email}</span>
                    </div>

                    <div className={postCardClass.leftMobileRowTwo}>
                        {/* Number of replies */}
                        <span className="hidden lg:flex">{bull}</span> 
                        <p className='inline-flex'>{`${commentsSnapshot ? commentsSnapshot.docs.length : "0"}`}
                            <span className="hidden md:flex md:ml-1">Comments</span>
                        </p>
                        {/* TODO: interpolate post category below */}
                        {bull} <p className="font-bold text-primary">Education</p>
                        {bull}
                        {/* Time stamp */}
                        <Timestamp timestamp={timestamp} />
                        {/* TODO: Figure out where to put comments count */}
                    </div>
                </div>
            </div>

            {/* Right: More Button */}
            <div className={postCardClass.headerRight}>
                <PostOptionsDropdown authorUid={authorUid} authorName={name ? name : email} deletePost={deletePost}/>
            </div>
        </div>
    )
};

export default PostHeader;
