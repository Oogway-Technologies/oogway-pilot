import Timestamp from '../../Utils/Timestamp';
import React from 'react';
import needsHook from '../../../hooks/needsHook';
import { avatarURL, postCardClass } from '../../../styles/feed';
import bull from '../../Utils/Bullet';
import PostOptionsDropdown from '../Post/PostOptionsDropdown';
import { db } from '../../../firebase';
import { Avatar } from '@mui/material';

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
                        <span className={postCardClass.bullSpan}>{bull}</span> 
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
    );
};

export default CommentHeader;
