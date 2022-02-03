import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { replyClass } from "../../../styles/feed";
import ReplyHeader from './ReplyHeader';
import ReplyEngagementBar from './ReplyEngagementBar';
import firebase from 'firebase/compat/app';

type ReplyProps = {
    replyOwner: string,
    postId: string | string[] | undefined,
    commentId: string,
    replyId: string,
    reply: firebase.firestore.DocumentData
}

const Reply: React.FC<ReplyProps> = (
    { 
        replyOwner, 
        postId,
        commentId,
        replyId,
        reply 
    }) => {
  const [numLikes, setNumLikes] = useState(0);

  // Use useEffect to bind on document loading the
  // function that will set the number of likes on
  // each change of the DB (triggered by onSnapshot)
  useEffect(() => {
    db.collection("posts")
      .doc(postId)
      .collection("comments")
      .doc(commentId)
      .collection("replies")
      .doc(replyId)
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

  const getNumLikes = () => {
    return numLikes;
  };

  return (
       <div className={replyClass.outerDiv}>
                {/* Header */}
                <ReplyHeader
                    postId={postId}
                    commentId={commentId}
                    replyId={replyId} 
                    authorUid={replyOwner} 
                    userImage={reply.photoURL} 
                    name={reply.author} 
                    email={reply.email} 
                    timestamp={reply.timestamp}
                />

                <div className={replyClass.innerDiv}>
                    <div className={replyClass.dividerLeft}></div>
                    <div className={replyClass.dividerRight}>
                        {/* Body */}
                        <div className={replyClass.body}>
                            <p className={replyClass.bodyDescription}>
                                {reply.message}
                            </p>
                        </div>
                    
                        {/* Engagement */}
                        <ReplyEngagementBar 
                            postId={postId}
                            commentId={commentId}
                            replyId={replyId}
                        />
                    </div>

            </div>
       </div>
  );
}

export default Reply;
