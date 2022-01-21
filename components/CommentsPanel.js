import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../firebase";
import { useRouter } from "next/router";
import Comment from "./Comment";

function CommentsPanel({ comments }) {
  const router = useRouter();

  // Get a snapshot of the comments from the DB
  const [commentsSnapshot] = useCollection(
    db
      .collection("posts")
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
          postId={router.query.id}
          commentId={comment.id}
          comment={comment}
        />
      ));
    }
  };

  return <div>{showComments()}</div>;
}

export default CommentsPanel;
