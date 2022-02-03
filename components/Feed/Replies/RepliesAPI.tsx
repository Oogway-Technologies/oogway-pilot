import React from 'react';
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../../../firebase";
import { useRouter } from "next/router";
import Reply from './Reply';
import { repliesApiClass } from '../../../styles/feed';
import { SpinnerCircular } from 'spinners-react';

type RepliesAPIProps = {
    commentId: string
}

const RepliesAPI: React.FC<RepliesAPIProps> = ({ commentId }) => {
    const router = useRouter();

    // Get a snapshot of the replies from the DB
    const [repliesSnapshot] = useCollection(
        db.collection("posts")
        .doc(router.query.id)
        .collection("comments")
        .doc(commentId)
        .collection("replies")
        .orderBy("timestamp", "asc")
    );

    const showReplies = () => {
        return (
            <div className={repliesApiClass.outerDiv}>
                {repliesSnapshot.docs.map((reply) => (
                    <Reply
                        key={reply.id}
                        replyOwner={reply.data().authorUid}
                        postId={router.query.id}
                        commentId={commentId}
                        replyId={reply.id}
                        reply={{
                            ...reply.data(),
                            timestamp: reply.data().timestamp?.toDate().getTime(),
                        }}
                    />
                ))}
            </div>
        )
    };


    return (
        <>{repliesSnapshot?.docs.length > 0 && showReplies()}</>     
    );
};

export default RepliesAPI;
