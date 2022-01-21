import { useEffect, useState } from "react";
import Image from "next/image";
import { ChatAltIcon, ShareIcon, ThumbUpIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { auth, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

function PostAPI({ id, name, message, email, postImage, image, timestamp }) {
  // Use the router to redirect the user to the comments page
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [votesList, setVotesList] = useState([]);

  const avatarURL =
    "https://i.guim.co.uk/img/media/26392d05302e02f7bf4eb143bb84c8097d09144b/446_167_3683_2210/master/3683.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=49ed3252c0b2ffb49cf8b508892e452d";

  const enterComments = () => {
    router.push(`/comments/${id}`);
  };

  const isComparePost = (postData) => {
    return "compare" in postData;
  };

  // Use useEffect to bind on document loading the
  // function that will list for DB updates to the
  // setters of number of votes for a comparison
  // post
  useEffect(() => {
    db.collection("posts")
      .doc(id)
      .onSnapshot((snapshot) => {
        const postData = snapshot.data();
        if (isComparePost(postData)) {
          // Add a counter of votes for each object to compare.
          // Note: this should generally be an array of 2 objects
          let votesCounter = new Array(
            postData.compare.votesObjMapList.length
          ).fill(0);
          for (var i = 0; i < votesCounter.length; i++) {
            votesCounter[i] = Object.keys(
              postData.compare.votesObjMapList[i]
            ).length;
          }

          // Update the vote counter
          setVotesList(votesCounter);
        }
      });
  }, []);

  const voteOnImage = (objIdx) => {
    // Add a vote, for this user, to one of the images
    var docRef = db.collection("posts").doc(id);

    return db.runTransaction((transaction) => {
      return transaction.get(docRef).then((doc) => {
        const postData = doc.data();
        if (isComparePost(postData)) {
          // This is probably not needed (vote is only enabled on compare posts)
          // Different scenarios to consider
          for (var i = 0; i < postData.compare.votesObjMapList.length; i++) {
            // Case 1: the user voted for an object in the past
            if (user.uid in postData.compare.votesObjMapList[i]) {
              // Case 1.a: the user voted again on same object -> nothing to do
              if (i === objIdx) {
                return;
              }

              // Case 1.b: the user voted again on different object -> switch votes
              delete postData.compare.votesObjMapList[i][user.uid];
              postData.compare.votesObjMapList[objIdx][user.uid] = true;
              transaction.update(docRef, postData);
              return;
            }
          }
          // Case 2: this is the first time for the user voting on this object
          postData.compare.votesObjMapList[objIdx][user.uid] = true;
          transaction.update(docRef, postData);
        }
      });
    });

    /*db.collection("posts")
      .doc(id)
      .get()
      .then((doc) => {
        const postData = doc.data();
        if (isComparePost(postData)) {
          // Different scenarios to consider
          for (var i = 0; i < postData.compare.votesObjMapList.length; i++) {
            // Case 1: the user voted for an object in the past
            if (user.uid in postData.compare.votesObjMapList[i]) {
              // Case 1.a: the user voted again on same object -> nothing to do
              if (i === objIdx) {
                return;
              }

              // Case 1.b: the user voted again on different object -> switch votes
              delete postData.compare.votesObjMapList[i][user.uid];
              postData.compare.votesObjMapList[objIdx][user.uid] = true;
              doc.ref.update(postData);
              return;
            }
          }

          // Case 2: this is the first time for the user voting on this object
          postData.compare.votesObjMapList[objIdx][user.uid] = true;
          doc.ref.update(postData);
        }
      });*/
  };

  return (
    <div className="flex flex-col">
      <div className="p-5 bg-white mt-5 rounded-t-2xl shadow-md shadow-indigo-500/50">
        <div className="flex items-center space-x-2">
          <img
            className="rounded-full"
            src={image ? image : avatarURL}
            width={40}
            height={40}
            alt=""
          />
          <div>
            <p className="font-medium text-black">{name}</p>
            {timestamp ? (
              <p className="text-xs text-gray-400">
                {new Date(timestamp?.toDate()).toLocaleString()}
              </p>
            ) : (
              // Do this for prefetching from server-side
              <p className="text-xs text-gray-400">Loading</p>
            )}
          </div>
        </div>
        <p className="pt-4 text-black">{message}</p>
      </div>
      {/* Only if there is a post image show the image */}
      {postImage && (
        <div className="relative h-56 md:h-96 bg-white">
          {/* Fill the image RELATIVE to the parent.
            Note: the parent MUST be relative!
            Note: using contain works but the image doesn't cover the whole space
            Note: using cover doesn't work well unless we resize the image
          */}
          <Image src={postImage} objectFit="cover" layout="fill" />
        </div>
      )}

      {/* Vote MOCK UI */}
      <div className="flex bg-white justify-around p-3">
        <div className="flex flex-col items-center">
          <button
            className="btn"
            onClick={() => {
              voteOnImage(0);
            }}
          >
            Vote Left
          </button>
          <p className="text-black">{votesList[0]} votes</p>
        </div>
        <div className="flex flex-col items-center">
          <button
            className="btn"
            onClick={() => {
              voteOnImage(1);
            }}
          >
            Vote Right
          </button>
          <p className="text-black">{votesList[1]} votes</p>
        </div>
      </div>

      {/* Footer of the post */}
      <div className="flex justify-between items-center rounded-b-2xl bg-white shadow-md text-gray-400 border-t">
        <div className="inputIcon rounded-none rounded-bl-2xl">
          <ThumbUpIcon className="h-4" />
          <p className="text-xs sm:text-base">Like</p>
        </div>

        <div className="inputIcon" onClick={enterComments}>
          <ChatAltIcon className="h-4" />
          <p className="text-xs sm:text-base">Comment</p>
        </div>

        <div className="inputIcon rounded-none rounded-br-2xl">
          <ShareIcon className="h-4" />
          <p className="text-xs sm:text-base">Share</p>
        </div>
      </div>
    </div>
  );
}

export default PostAPI;
