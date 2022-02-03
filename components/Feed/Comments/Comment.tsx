import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { commentClass } from "../../../styles/feed";
import { CardMedia, Collapse } from "@mui/material";
import CommentHeader from './CommentHeader';
import CommentEngagementBar from './CommentEngagementBar';
import NewReplyForm from "../Forms/NewReplyForm";
import RepliesAPI from "../Replies/RepliesAPI";

// TODO: Needs type interface
function Comment({ commentOwner, postId, commentId, comment }) {
  const [numLikes, setNumLikes] = useState(0);
  
  // Track comment reply form visibility
  const [expandedReplyForm, setExpandedReplyForm] = useState(false);

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

  const getNumLikes = () => {
    return numLikes;
  };

  return (
    <div className={commentClass.outerDiv}>
        {/* Header */}
        <CommentHeader
            postId={postId} 
            commentId={commentId} 
            authorUid={commentOwner} 
            userImage={comment.photoURL} 
            name={comment.author} 
            email={comment.email} 
            timestamp={comment.timestamp}
        />

        {/* Body */}
        <div className={commentClass.body}>
            <p className={commentClass.bodyDescription}>
                {comment.message}
            </p>
        </div>
        
        {/* Media */}
        {comment.image && <div className={commentClass.media}><CardMedia component="img" src={comment.image}/></div>}

        {/* Engagement */}
        <CommentEngagementBar 
            postId={postId}
            commentId={commentId}
            handleReply={() => setExpandedReplyForm(!expandedReplyForm)}
            expanded={expandedReplyForm}
        />

        {/* Reply Form */}
        <Collapse in={expandedReplyForm} timeout="auto" unmountOnExit>
            <div className={commentClass.replyDropdown}>
                <NewReplyForm 
                    commentId={commentId}
                    placeholder="What would you like to say back?"
                />
            </div>
        </Collapse>

        {/* Replies API */}
        <RepliesAPI commentId={commentId} />
    </div>

  );
}

export default Comment;
