import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { XIcon } from "@heroicons/react/solid";

function Comment({ commentOwner, postId, commentId, comment }) {
  const [user] = useAuthState(auth);
  const [numLikes, setNumLikes] = useState(0);

  const avatarURL =
    "https://i.guim.co.uk/img/media/26392d05302e02f7bf4eb143bb84c8097d09144b/446_167_3683_2210/master/3683.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=49ed3252c0b2ffb49cf8b508892e452d";

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
  };

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

  const addLike = (e) => {
    e.preventDefault(); // Don't think it is needed
    db.collection("posts")
      .doc(postId)
      .collection("comments")
      .doc(commentId)
      .get()
      .then((doc) => {
        // Here goes the logic for toggling likes from each user
        if (doc.exists) {
          // Get a reference to the comment
          let tmp = doc.data();

          // Step 1: check if user.uid is in the list
          if (user.uid in tmp.likes) {
            // Negate what the user previously did
            tmp.likes[user.uid] = !tmp.likes[user.uid];
          } else {
            // The user liked the comment
            tmp.likes[user.uid] = true;
          }

          // Update comment.
          // Note: a simple update here is fine.
          // No need for a transaction, since even if a like is lost,
          // That event is very rare and probably not so much of a pain
          doc.ref.update(tmp);
        } else {
          console.log("Error comment not found: " + commentId);
        }
      });
  };

  return (
    <div className="flex flex-col p-4">
      <div className="flex items-center">
        <img
          className="rounded-full"
          src={comment.photoURL ? comment.photoUrl : avatarURL}
          width={40}
          height={40}
          alt=""
        />
        <h1 className="text-black">{comment.user}</h1>
      </div>

      <p className="text-black mb-2">{comment.message}</p>

      {/* Likes and other stuff go here */}
      <h2 className="text-black mb-2">
        {getNumLikes()}
        Likes
      </h2>

      {/* Likes: the user can either LIKE or DISLIKE */}
      <button
        className="w-1/5 ml-2 bg-gray-200 p-3 mb-3 rounded-md ring-gray-200 text-sm text-gray-800
            hover:ring-1 focus:outline-none active:ring-gray-300 hover:shadow-md"
        onClick={addLike}
      >
        Like
      </button>

      {/* Show cancel button only for the user owning the post */}
      {/* THIS CAN GO IN THE "..." TOP RIGHT OR WHEREVER MAKES SENSE */}
      {user?.uid === commentOwner ? (
        <XIcon
          className="h-7 sm:mr-3 text-gray-500 cursor-pointer 
          transition duration-100 transform hover:scale-125"
          onClick={deleteComment}
        />
      ) : null}

      <hr className="" />
    </div>
  );
}

export default Comment;
