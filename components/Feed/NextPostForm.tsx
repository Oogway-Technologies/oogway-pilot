import React, { useRef, useState }  from 'react';

import firebase from "firebase/compat/app";
import { auth, db, storage } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import Button from '../Utils/Button';
import { Dialog } from '@headlessui/react';
import { UilNavigator, UilImagePlus, UilTimesCircle } from '@iconscout/react-unicons'

type NewPostAPIProps = {
    closeModal: React.MouseEventHandler<HTMLButtonElement>
};

const NewPostAPI: React.FC<NewPostAPIProps> = ({ closeModal }) => {
    const [user] = useAuthState(auth);

    // The image to post and to display as preview
    const [imageToPost, setImageToPost] = useState(null);

    // This is a trick I need to use to reset the state and allow the user
    // to load the same image twice
    const [targetEvent, setTargetEvent] = useState(null);

    // Get a reference to the input text
    const inputRef = useRef(null);

    // Get a reference to the description text
    const descriptionRef = useRef(null);

    // Get a reference for the input image
    const filePickerRef = useRef(null);

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

    // Helper functions
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
        setImageToPost(null);
        if (targetEvent) {
            // Reset the event state so the user can reload
            // the same image twice
            targetEvent.target.value = "";
        }
    };

    const sendAndClose = (e) => {
        e.preventDefault();
        sendPost(e);
        closeModal(e);
    }

    // Button styles
    const cancelButtonStyle = "p-sm w-full justify-center \
        bg-neutral-150 hover:bg-neutral-300 text-neutral-700 text-sm font-bold"
    
    const PostButtonStyle = "p-sm w-full space-x-2 justify-center \
        bg-primary dark:bg-primaryDark hover:bg-primaryActive \
        active:bg-primaryActive dark:hover:bg-primaryActive \
        dark:active:bg-primaryActive text-white font-bold"

    const imageButtonStyle = "inline-flex p-sm rounded-[20px] \
        text-neutral-700 dark:text-neutralDark-150 \
        hover:font-bold active:font-bold dark:hover:font-bold dark:active:font-bold \
        hover:bg-neutral-50 dark:hover:bg-neutralDark-300 active:bg-primary/20 dark:active:bg-primaryDark/20\
        hover:text-neutral-700 dark:hover:text-neutralDark-150 active:text-primary dark:active:text-primaryDark"

    return (
        <div className='flex-col bg-white dark:bg-neutralDark-500'>
            <Dialog.Title
                as="div"
                className="flex px-2 py-md text-lg font-bold  text-neutral-800 dark:text-neutralDark-50"
            >
                What's your question?
            </Dialog.Title>

            {/* Question form */}
            <form className="flex-col p-sm space-y-3">
                {/* Question: required */}
                <div 
                className="border-solid border-[1px] border-neutral-300 lg:w-96 xl:w-128 focus-within:border-primary
                focus-visible:border-primary active:border-neutral-300 alert:border-alert rounded-[8px]">
                    <input
                        className='h-12 bg-transparent flex-grow px-5 focus:outline-none text-sm'
                        type='text'
                        ref={inputRef}
                        placeholder={`Type your question...`}
                        required
                    />
                </div>
                <div 
                className="border-solid border-[1px] border-neutral-300 lg:w-96 xl:w-128 focus-within:border-primary
                focus-visible:border-primary active:border-neutral-300 alert:border-alert rounded-[8px]">
                    <textarea
                        ref={descriptionRef}
                        placeholder={`Description (optional)`}
                        className="resize-none w-full h-28 bg-transparent flex-grow py-2 px-5 focus:outline-none text-sm"/>
                </div>
                
            </form>

            {/* Upload Image */}
            <div className="inline-flex w-full space-x-3 px-2 pt-md pb-xl">
                <button
                    onClick={() => filePickerRef.current.click()}
                    className={imageButtonStyle}
                >
                    <UilImagePlus />
                    <input
                        ref={filePickerRef}
                        onChange={(e) => {
                            // Store the event to reset its state later
                            // and allow the user to load the same image twice
                            // if needed
                            setTargetEvent(e);
                            addImageToPost(e);
                        }}
                        type='file'
                        hidden
                    />
                    
                </button>
            </div>
            
            {/* Show preview of the image and click it to remove the image from the post */}
            {/* TODO: Generalize to handle an array of images */}
            {imageToPost && (
            <div
                className='inline-flex px-2'
            >
                {/* TODO: Can re-factor this to map across both images for A vs B */}
                <div className="flex flex-col items-center">
                    <img className="flex rounded-[8px] h-20  object-contain" src={imageToPost} alt='' />
                    <UilTimesCircle className="flex my-md cursor-pointer text-neutral-700 hover:text-error" onClick={removeImage}/>
                </div>
                
            </div>
            )}

            {/* Cancel / Submit buttons */}
            <div className="inline-flex w-full space-x-3 px-2">
                    <Button text="Cancel" keepText={true} icon={null}
                        type='button' 
                        addStyle={cancelButtonStyle}
                        onClick={closeModal}
                    />
                    <Button text="Post" keepText={true} icon={<UilNavigator/>}
                        type="submit"
                        addStyle={PostButtonStyle}
                        onClick={sendAndClose}/>
                </div>
            </div>
    );
};

export default NewPostAPI;
