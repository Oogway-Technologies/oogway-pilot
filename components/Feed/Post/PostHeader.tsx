import React, { useState, useEffect } from 'react';
import needsHook from '../../../hooks/needsHook';
import { auth, db, storage } from '../../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import PostOptionsDropdown from './PostOptionsDropdown';
import { Avatar } from '@mui/material';
import { postCardClass, avatarURL } from '../../../styles/feed';
import bull from '../../Utils/Bullet';
import Timestamp from '../../Utils/Timestamp';
import { useCollection } from 'react-firebase-hooks/firestore';
import { UilComment, UilThumbsUp } from '@iconscout/react-unicons'

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
    const [numLikes, setNumLikes] = useState(0);
    
    // Use useEffect to bind on document loading the
    // function that will set the number of likes on
    // each change of the DB (triggered by onSnapshot)
    useEffect(() => {
        db.collection("posts")
        .doc(id)
        .onSnapshot((snapshot) => {
            // Get the likes map
            const likesMap = snapshot.data().likes;
    
            // Count the entries that are True
            let ctr = 0;
            for (const [key, value] of Object.entries(likesMap)) {
            if (value) {
                ctr += 1;
            }
            }
            setNumLikes(ctr);
        });
    }, []);

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

        // Delete the post's media, if any
        storage.ref(`posts/${id}`).listAll().then((listResults) => {
            const promises = listResults.items.map((item) => {
                return item.delete();
            });
            Promise.all(promises);
        });

        return true
    }

    const getNumLikes = () => {
        return numLikes;
    };

    return (
        <div className={postCardClass.header}>
            {/* Left content */}
            <div className={postCardClass.headerLeft}>
                {/* Avatar */}
                <Avatar
                        onClick={needsHook}
                        className={postCardClass.avatar}
                        src={userImage ? userImage : avatarURL} 
                    />

                {/* Split into two rows on mobile */}
                <div className={postCardClass.infoDiv}>
                    <div className={postCardClass.leftMobileRowOne}>
                        {/* User Name */}
                        <span className="pl-sm font-bold">{name ? name : email}</span>
                    </div>

                    <div className={postCardClass.leftMobileRowTwo}>
                        {/* Number of replies */}
                        <span className={postCardClass.bullSpan}>{bull}</span> 
                        <p className={postCardClass.commentsP}>{`${commentsSnapshot ? commentsSnapshot.docs.length : "0"}`}
                            <span className={postCardClass.commentsSpan}> Comments</span>
                            <span className={postCardClass.commentsIconSpan}><UilComment size={14}/></span>
                        </p>
                        {/* Number of likes */}
                        {bull} 
                        <p className={postCardClass.commentsP}>{`${getNumLikes() > 0 ? getNumLikes() : "0"}`}
                            <span className={postCardClass.commentsSpan}> Likes</span>
                            <span className={postCardClass.commentsIconSpan}><UilThumbsUp size={14}/></span>
                        </p>
                        {/* TODO: interpolate post category below */}
                        {bull} <p className={postCardClass.categoryP}>Education</p>
                        {bull}
                        {/* Time stamp */}
                        <Timestamp timestamp={timestamp} />
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
