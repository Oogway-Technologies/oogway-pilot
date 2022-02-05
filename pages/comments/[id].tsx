import { auth, db } from "../../firebase";
import { useRouter } from "next/router";
import Head from "next/head";
import PostCard from "../../components/Feed/Post/Post";
import Button from "../../components/Utils/Button";
import { UilArrowCircleLeft } from '@iconscout/react-unicons'
import { commentsPageClass } from "../../styles/feed";
import { useAuthState } from 'react-firebase-hooks/auth';


function CommentPage({ post, comments }) {
    const [user] = useAuthState(auth);

  // Use the router to go back on the stack
  const router = useRouter();

  const goBack = () => {
    router.push(`/feed/${user.uid}`);
  };

  return (
    <div className={commentsPageClass.outerDiv}>
        <Head>
            <title>{`Comments | ${post.message}`}</title>
        </Head>
        <div className={commentsPageClass.innerDiv}>
            <div className={commentsPageClass.contentDiv}>
              {/* Go Back */}
              <div className="flex items-center sticky top-0 backdrop-blur-md bg-gray/30 p-3 z-40 hover:shadow-sm mb-1">
                <Button 
                    text="Back" 
                    keepText={false}
                    forceNoText = { false }
                    icon={<UilArrowCircleLeft/>} 
                    type='button'
                    onClick={goBack}
                    addStyle={commentsPageClass.goBackButton}
                />
              </div>
            
            {/* Post w/ comments
            Pass Comments API to the PostCard as props */}
            <PostCard
                id={post.id}
                authorUid={post.uid}
                name={post.name}
                message={post.message}
                description={post.description}
                isCompare={post.isCompare}
                email={post.email}
                timestamp={post.timestamp}
                userImage={post.image}
                postImage={post.postImage}
                comments={comments}
                isCommentThread={true}
            />
            </div>
        </div> 
    </div>
  );
}

export default CommentPage;

// Prefetch the data prepared by the server
export async function getServerSideProps(context) {
  // Two things to prepare here:
  // 1. prepare the post (clone from what it is coming from);
  // 2. prepare the comments
  // Get the reference to the post this comments are for
  const ref = db.collection("posts").doc(context.query.id);

  // Prepare the post on the server
  // timestamp: JSON.parse(safeJsonStringify(postRes.data().timestamp))
  const postRes = await ref.get();
  const post = {
    id: postRes.id,
    ...postRes.data(),
    timestamp: postRes.data().timestamp.toDate().toLocaleString(), // DO NOT prefetch timestamp as is
  };

  // Prepare the comments
  const commentsRef = await ref
    .collection("comments")
    .orderBy("timestamp", "asc")
    .get();

  // Need to parse each comment and convert the timestamp
  // to a string due to server-side rendering
  const comments = commentsRef.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .map((comments) => ({
      ...comments,
      timestamp: comments.timestamp.toDate().getTime(),
    }));

  return {
    props: {
      post: post, // pass the post back as a doc
      comments: JSON.stringify(comments), // pass the comments back as docs
    },
  };
}
