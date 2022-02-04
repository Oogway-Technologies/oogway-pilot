import Timestamp from '../../Utils/Timestamp';
import React, { useEffect, useState } from 'react';
import needsHook from '../../../hooks/needsHook';
import { avatarURL, postCardClass, replyHeaderClass } from '../../../styles/feed';
import bull from '../../Utils/Bullet';
import PostOptionsDropdown from '../Post/PostOptionsDropdown';
import { db } from '../../../firebase';
import { Avatar } from '@mui/material';
import { UilThumbsUp } from "@iconscout/react-unicons";

type ReplyHeaderProps = {
    postId: string | string[] | undefined,
    commentId: string,
    replyId: string,
    authorUid: string,
    userImage: string | null,
    name: string | null,
    email: string,
    timestamp: Date | null
};

const ReplyHeader: React.FC<ReplyHeaderProps> = (
    {
        postId,
        commentId,
        replyId,
        userImage,
        name,
        authorUid,
        email,
        timestamp
    }) => {
    const [numLikes, setNumLikes] = useState(0);

    // Use useEffect to bind on document loading the
    // function that will set the number of likes on
    // each change of the DB (triggered by onSnapshot)
    useEffect(() => {
        const unsubRef = db.collection("posts")
        .doc(postId)
        .collection("comments")
        .doc(commentId)
        .collection("replies")
        .doc(replyId)
        .onSnapshot((snapshot) => {
            if (snapshot.data()) {
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
            }
        });

        return () => unsubRef();
    }, [postId, commentId, replyId]);
    
    const getNumLikes = () => {
        return numLikes;
    };

    // Deletes a reply
    const deleteReply = () => {
        db.collection("posts")
        .doc(postId)
        .collection("comments") // Or whatever the name of the collection is
        .doc(commentId)
        .collection("replies")
        .doc(replyId)
        .delete()
        .catch((err) => {
            console.log("Cannot delete reply: ", err);
        });

        // Update the user's reply map
        db.collection("users")
        .doc(user.uid)
        .get()
        .then((doc) => {
            let tmp = doc.data();
            delete tmp.replies[replyId];
            doc.ref.update(tmp);
        })

        // Return where the user should be routed
        return `/comments/${postId}`
    };

    return (
        <div className={postCardClass.header}>
             {/* Left content */}
             <div className={postCardClass.headerLeft}>
                {/* Avatar */}
                <Avatar
                    onClick={needsHook}
                    className={replyHeaderClass.avatar}
                    src={userImage ? userImage : avatarURL} 
                />

                {/* Split into two rows on mobile */}
                <div className={postCardClass.infoDiv}>
                    <div className={postCardClass.leftMobileRowOne}>
                        {/* User Name */}
                        <span className="pl-sm font-bold">{name ? name : email}</span>
                    </div>

                    <div className={postCardClass.leftMobileRowTwo}>
                        {/* Number of likes */}
                        <p className={postCardClass.commentsP}>{`${getNumLikes() > 0 ? getNumLikes() : "0"}`}
                            <span className={postCardClass.commentsSpan}> Likes</span>
                            <span className={postCardClass.commentsIconSpan}><UilThumbsUp size={14}/></span>
                        </p>
                        {bull}
                        {/* Time stamp */}
                        <Timestamp timestamp={timestamp} />
                    </div>
                </div>
            </div>

            {/* Right: More Button */}
            <div className={postCardClass.headerRight}>
                <PostOptionsDropdown authorUid={authorUid} authorName={name ? name : email} deletePost={deleteReply}/>
            </div>
        </div>
    );
};

export default ReplyHeader;
