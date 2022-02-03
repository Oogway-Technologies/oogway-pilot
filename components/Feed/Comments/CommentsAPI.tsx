import React from 'react';
import { useCollection, useDocumentData } from "react-firebase-hooks/firestore";
import { auth, db } from "../../../firebase";
import { useRouter } from "next/router";
import Comment from "./Comment";
import { avatarURL, commentsApiClass } from '../../../styles/feed';
import { doc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import needsHook from '../../../hooks/needsHook';
import { Avatar } from '@mui/material';
import firebase from 'firebase/compat/app';
import NewCommentForm from '../Forms/NewCommentForm';


type CommentsAPIProps = {
    comments: firebase.firestore.QueryDocumentSnapshot
}

const CommentsAPI: React.FC<CommentsAPIProps> = ({ comments }) => {
    const router = useRouter();

    // Retrieve user profile
    const [user] = useAuthState(auth);
    const [userProfile] = useDocumentData(doc(db, "profiles", user.uid))

    // Get a snapshot of the comments from the DB
    const [commentsSnapshot] = useCollection(
        db.collection("posts")
        .doc(router.query.id)
        .collection("comments")
        .orderBy("timestamp", "asc")
    );


    const showComments = () => {
        // Check if the snapshot is ready,
        // if so show the comments.
        // If not, show the props comments
        if (commentsSnapshot) {
            return commentsSnapshot.docs.map((comment) => (
                <Comment
                    key={comment.id}
                    commentOwner={comment.data().authorUid}
                    postId={router.query.id}
                    commentId={comment.id}
                    comment={{
                        ...comment.data(),
                        timestamp: comment.data().timestamp?.toDate().getTime(),
                    }}
                />
            ));
        } else {
        // Visualize the server-side rendered comments
            return JSON.parse(comments).map((comment) => (
                <Comment
                    key={comment.id}
                    commentOwner={comment.authorUid}
                    postId={router.query.id}
                    commentId={comment.id}
                    comment={comment}
                />
            ));
        }
    };


    return (
        <div className={commentsApiClass.outerDiv}>
            <hr className={commentsApiClass.hr}/>
            {/* New Comment Form */}
            <div className={commentsApiClass.innerDiv}>
                <Avatar
                    onClick={needsHook}
                    className={commentsApiClass.avatar}
                    src={userProfile?.profilePic ? userProfile.profilePic : avatarURL} 
                /> 
                <NewCommentForm  
                    placeholder={userProfile?.name ? 
                        `What do you think, ${userProfile.name}?` 
                        : 'What do you think?'}
                />
            </div>

            {/* Comment counter */}
            <p className={commentsApiClass.counter}>
                {commentsSnapshot ? commentsSnapshot.docs.length : JSON.parse(comments).length} Answers
            </p>
            
            {/* Post's Comments */}
            {showComments()}     
        </div>
    );
};

export default CommentsAPI;
