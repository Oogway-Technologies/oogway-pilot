import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { EmojiHappyIcon } from "@heroicons/react/outline";
import { CameraIcon, VideoCameraIcon } from "@heroicons/react/solid";
import { useRef, useState } from "react";
import { db, storage } from "../firebase";
import firebase from "firebase/compat/app";

function InputBoxAPI() {
  const [user] = useAuthState(auth);

  // The image to post and to display as preview
  const [imageToPost, setImageToPost] = useState(null);

  // This is a trick I need to use to reset the state and allow the user
  // to load the same image twice
  const [targetEvent, setTargetEvent] = useState(null);

  // Get a reference to the input text
  const inputRef = useRef(null);

  // Get a reference for the input image
  const filePickerRef = useRef(null);

  const avatarURL =
    "https://i.guim.co.uk/img/media/26392d05302e02f7bf4eb143bb84c8097d09144b/446_167_3683_2210/master/3683.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=49ed3252c0b2ffb49cf8b508892e452d";

  const sendPost = (e) => {
    e.preventDefault();

    // If the input is empty, return asap
    if (!inputRef.current.value) return;

    // Get the DB and add a post to the posts collection
    db.collection("posts")
      .add({
        message: inputRef.current.value,
        name: user.name ? user.name : user.email, // Change this with username or incognito
        email: user.email,
        image: user.photoURL, // Change this with profile picture or incognito
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then((doc) => {
        // After posting, check if the user has selected and image to post
        if (imageToPost) {
          // Funky upload stuff for the image:
          // take the base64 encoded image and push it to the Firebase storage DB.
          // Note: this goes in the Storage DB under a folder named posts/[document_id]
          const uploadTask = storage
            .ref(`posts/${doc.id}`)
            .putString(imageToPost, "data_url");

          // Remove image preview
          removeImage();

          // When the state changes run the following function
          uploadTask.on(
            "state_change",
            null,
            (error) => console.error(error),
            () => {
              // When the uploads completes.
              // Note: ref(`post`).child(doc.id) === `posts/${doc.id}`.
              // Note: getDownloadURL() -> get the URL to use on the front-end
              storage
                .ref("posts")
                .child(doc.id)
                .getDownloadURL()
                .then((url) => {
                  // Store the URL in the DB as part of the post
                  db.collection("posts").doc(doc.id).set(
                    {
                      postImage: url,
                    },
                    { merge: true }
                  ); // Use merge: true! otherwise it replaces the Post!
                });
            }
          );
        }
      });

    // Clear the input
    inputRef.current.value = "";
  };

  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      // Read the file
      reader.readAsDataURL(e.target.files[0]);
    }

    // Reader is async, so use onload to attach a function
    // to set the loaded image from the reader
    reader.onload = (readerEvent) => {
      setImageToPost(readerEvent.target.result);
      if (targetEvent) {
        // Reset the event state so the user can reload
        // the same image twice
        targetEvent.target.value = "";
      }
    };
  };

  const removeImage = () => {
    // Helper function
    setImageToPost(null);
    if (targetEvent) {
      // Reset the event state so the user can reload
      // the same image twice
      targetEvent.target.value = "";
    }
  };

  return (
    <div className="bg-white p-2 rounded-2xl shadow-xl shadow-indigo-500/50 text-gray-500 font-medium mt-6">
      <div className="flex space-x-4 p-4 items-center">
        <img
          loading="lazy"
          className="h-10 rounded-full cursor-pointer transition duration-150 transform hover:scale-110"
          src={avatarURL}
          alt="Profile Pic"
          width={40}
          height={40}
          layout="fixed"
        />
        <form className="flex flex-1">
          <input
            className="rounded-full h-12 bg-gray-100 flex-grow px-5 focus:outline-none"
            type="text"
            ref={inputRef}
            placeholder={`What's up ${user.name ? user.name : user.email}?`}
          />
          <button hidden onClick={sendPost} type="submit">
            Submit
          </button>
        </form>

        {/* Show preview of the image and click it to remove the image from the post */}
        {imageToPost && (
          <div
            onClick={removeImage}
            className="flex flex-col filter hover:brightness-110 transition 
          duration-150 transform hover:scale-105 cursor-pointer"
          >
            <img className="h-10 object-contain" src={imageToPost} alt="" />
            <p className="text-xs text-red-500 text-center">Remove</p>
          </div>
        )}
      </div>

      <div className="flex justify-evenly p-3 border-t">
        <div className="inputIcon">
          <VideoCameraIcon className="h-7 text-red-500" />
          <p className="text-xs sm:text-sm xl:text-base">Live Video</p>
        </div>
        <div
          onClick={() => filePickerRef.current.click()}
          className="inputIcon"
        >
          <CameraIcon className="h-7 text-green-400" />
          <p className="text-xs sm:text-sm xl:text-base">Photo/Video</p>
          <input
            ref={filePickerRef}
            onChange={(e) => {
              // Store the event to reset its state later
              // and allow the user to load the same image twice
              // if needed
              setTargetEvent(e);
              addImageToPost(e);
            }}
            type="file"
            hidden
          />
        </div>
        <div className="inputIcon">
          <EmojiHappyIcon className="h-7 text-yellow-300" />
          <p className="text-xs sm:text-sm xl:text-base">Feeling/Activity</p>
        </div>
      </div>
    </div>
  );
}

export default InputBoxAPI;
