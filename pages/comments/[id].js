import {
  ArrowLeftIcon,
  DotsVerticalIcon,
  ChatAltIcon,
  ThumbUpIcon,
} from "@heroicons/react/outline";
import Image from "next/image";
import { db } from "../../firebase";
import { useRouter } from "next/router";
import { useRef } from "react";
import firebase from "firebase/compat/app";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import CommentsPanel from "../../components/CommentsPanel";
import { v4 as uuidv4 } from "uuid";

function CommentPage({ post, comments }) {
  const [user] = useAuthState(auth);

  // Use the router to go back on the stack
  const router = useRouter();

  // Get a reference to the input text
  const inputRef = useRef(null);

  const avatarURL =
    "https://i.guim.co.uk/img/media/26392d05302e02f7bf4eb143bb84c8097d09144b/446_167_3683_2210/master/3683.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=49ed3252c0b2ffb49cf8b508892e452d";

  const goBack = () => {
    router.back();
  };

  const [commentsSnapshot] = useCollection(
    db.collection("posts").doc(router.query.id).collection("comments")
    //db.collection("comments").doc(router.query.id).collection("comments")
  );

  const addComment = (e) => {
    e.preventDefault();

    // Return asap if no input
    if (!inputRef.current.value) return;

    // First of all, update last seen entry for the user
    // currently posting a comment
    db.collection("users").doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    ); // Remember to MERGE the content otherwise it will be overwritten!

    // Now add a new comment for this post
    db.collection("posts").doc(router.query.id).collection("comments").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: inputRef.current.value,
      user: user.email,
      photoURL: user.photoURL,
      likes: {}, // This is a map <user.uid, bool> for liked/disliked for each user
      commentUID: uuidv4(), // This is used to uniquely identify the comment, e.g., to remove it
    });

    // Clear the input
    inputRef.current.value = "";
  };

  return (
    <div className="grid place-items-center h-screen pb-36">
      <div className="w-3/4 mt-10 bg-white rounded-md shadow-md shadow-indigo-500/50">
        <div className="flex items-center p-2">
          <ArrowLeftIcon
            className="h-10 w-10 p-2 hover:bg-gray-100 rounded-full text-black cursor-pointer"
            onClick={goBack}
          />
        </div>
        <div className="flex flex-grow items-center justify-between">
          {/* Header post */}
          <div className="flex items-center space-x-2 ml-2">
            <img
              className="rounded-full"
              src={avatarURL}
              width={40}
              height={40}
              alt=""
            />
            <div>
              <p className="font-medium text-black">{post.email}</p>
              {post.timestamp ? (
                <p className="text-xs text-gray-400">{post.timestamp}</p>
              ) : (
                // Do this for prefetching from server-side
                <p className="text-xs text-gray-400">Loading</p>
              )}
            </div>
          </div>
          <DotsVerticalIcon className="text-black h-4 mr-2" />
        </div>
        {/* Post Content */}
        <div className="">
          <h1 className="p-3 text-black">{post?.message}</h1>
          {/* Only if there is a post image show the image */}
          {post.postImage && (
            <div className="relative h-56 md:h-96 bg-white">
              {/* Fill the image RELATIVE to the parent.
            Note: the parent MUST be relative!
            Note: using contain works but the image doesn't cover the whole space
            Note: using cover doesn't work well unless we resize the image
          */}
              <Image src={post.postImage} objectFit="cover" layout="fill" />
            </div>
          )}
        </div>
        {/* Post Footer */}
        {/* Note: it can be its own component*/}
        <div className="flex items-center p-3">
          <ChatAltIcon className="h-10 w-10 p-2 text-black" />

          <span className="p-1 text-xs sm:text-base text-black">
            {commentsSnapshot ? commentsSnapshot.docs.length : "..."} Comments
          </span>
          <ThumbUpIcon className="h-10 w-10 p-2 text-black" />
          <p className="p-1 text-xs sm:text-base text-black">3 Likes</p>
        </div>
        <form className="">
          <div className="flex w-full p-3">
            <input
              ref={inputRef}
              type="text"
              className="flex-grow text-black p-3 border-2 
            border-gray-500 rounded-md focus:outline-none bg-white"
            />
            <button
              onClick={addComment}
              type="submit"
              className="ml-2 bg-gray-200 p-3 rounded-md ring-gray-200 text-sm text-gray-800
            hover:ring-1 focus:outline-none active:ring-gray-300 hover:shadow-md"
            >
              Post
            </button>
          </div>
        </form>
      </div>

      <div className="w-3/4 mt-2 mb-5 rounded-md bg-white">
        {/* Comments */}
        {/* Note: pass the server-rendered comments to the panel */}
        <CommentsPanel comments={comments} />
      </div>
    </div>
  );
}

export default CommentPage;

// Prefetch the data prepared by the server
export async function getServerSideProps(context) {
  // Two things to prepare:
  // 1. prepare the post: this is going to be used to visualize post info on comments page
  // 2. prepare the comments: this is the actual list of current comments to the post
  // Get the reference to the post this comments are for
  const ref = db.collection("posts").doc(context.query.id);
  // const ref = db.collection("comments").doc(context.query.id);

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
      post: post, // pass the posts back as docs
      comments: JSON.stringify(comments), // pass the comments back as docs
    },
  };
}
