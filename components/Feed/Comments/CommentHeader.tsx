import Timestamp from '../../Utils/Timestamp';
import React, { useEffect, useState } from 'react';
import needsHook from '../../../hooks/needsHook';
import { avatarURL, postCardClass } from '../../../styles/feed';
import bull from '../../Utils/Bullet';
import PostOptionsDropdown from '../Post/PostOptionsDropdown';
import { db } from '../../../firebase';
import { Avatar } from '@mui/material';
import { useCollection } from 'react-firebase-hooks/firestore';
import { UilCornerUpLeftAlt, UilThumbsUp } from '@iconscout/react-unicons';

type CommentHeaderProps = {
    postId: string,
    commentId: string,
    authorUid: string,
    userImage: string | null,
    name: string | null,
    email: string,
    timestamp: Date | null
};

const CommentHeader = ({postId, commentId, userImage, name, authorUid, email, timestamp}: CommentHeaderProps) => {
    const [numLikes, setNumLikes] = useState(0);

    // Use useEffect to bind on document loading the
    // function that will set the number of likes on
    // each change of the DB (triggered by onSnapshot)
    useEffect(() => {
        db.collection("posts")
        .doc(postId)
        .collection("comments")
        .doc(commentId)
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
    const [repliesSnapshot] = useCollection(
        db.collection("posts")
        .doc(postId)
        .collection("comments")
        .doc(commentId)
        .collection("replies")
    );

    const getNumLikes = () => {
        return numLikes;
    };

    // Deletes a post
    const deletePost = () => {
        // OPEN A MODAL OR ASK THE USER IF HE/SHE IS SURE TO DELETE THE POST
        db.collection("posts")
        .doc(postId)
        .collection("comments") // Or whatever the name of the collection is
        .doc(commentId)
        .delete()
        .catch((err) => {
            console.log("Cannot delete post: ", err);
        });

        // Update the user's posts list
        db.collection("users")
        .doc(user.uid)
        .get()
        .then((doc) => {
            let tmp = doc.data();
            tmp.comments.delete(commentId);
            doc.ref.update(tmp);
        })

        // Delete the comment's media, if any
        storage.ref(`posts/${commentId}`).listAll().then((listResults) => {
            const promises = listResults.items.map((item) => {
                return item.delete();
            });
            Promise.all(promises);
        });

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
                        <p className={postCardClass.commentsP}>{`${repliesSnapshot ? repliesSnapshot.docs.length : "0"}`}
                            <span className={postCardClass.commentsSpan}> Replies</span>
                            <span className={postCardClass.commentsIconSpan}><UilCornerUpLeftAlt size={14}/></span>
                        </p>
                        {/* Number of likes */}
                        {bull}
                        <p className={postCardClass.commentsP}>{`${getNumLikes() > 0 ? getNumLikes() : "0"}`}
                            <span className={postCardClass.commentsSpan}> Likes</span>
                            <span className={postCardClass.commentsIconSpan}><UilThumbsUp size={14}/></span>
                        </p>
                        {/* Time stamp */}
                        {bull}
                        <Timestamp timestamp={timestamp} />
                    </div>
                </div>
            </div>

            {/* Right: More Button */}
            <div className={postCardClass.headerRight}>
                <PostOptionsDropdown authorUid={authorUid} authorName={name ? name : email} deletePost={deletePost}/>
            </div>
        </div>
    );
};

export default CommentHeader;
