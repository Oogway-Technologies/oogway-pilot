import React, { useEffect, useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useForm } from 'react-hook-form';
import { auth, db, storage } from '../../../firebase';
import { v4 as uuidv4 } from "uuid";
import { UilCommentPlus, UilExclamationTriangle, UilImagePlus, UilTimesCircle } from '@iconscout/react-unicons'
import useTimeout from '../../../hooks/useTimeout';
import { useRouter } from 'next/router';
import firebase from 'firebase/compat/app';
import { avatarURL, commentFormClass } from '../../../styles/feed';
import Button from '../../Utils/Button';
import preventDefaultOnEnter from '../../../hooks/preventDefaultOnEnter';

type NewCommentFormProps = {
    closeModal: React.MouseEventHandler<HTMLButtonElement>,
    isMobile: boolean,
    placeholder: string
};

const NewCommentForm: React.FC<NewCommentFormProps> = ({ closeModal, isMobile, placeholder }) => {
    const router = useRouter();
    const [user] = useAuthState(auth);

    // The image to post and to display as preview
    const [imageToPost, setImageToPost] = useState(null);
    const [targetEvent, setTargetEvent] = useState(null); // This is a trick I need to use to reset the state and allow the user
                                                        // to load the same image twice
    const filePickerRef = useRef(null);                   // Get a reference for the input image
    const inputRef = useRef(null);                        // Get a reference to the input text

    // Form management
    const { register, unregister, setError, formState: { errors } } = useForm();
    const warningTime = 3000; // set warning to flash for 3 sec
    useEffect(() => { // Register the form inputs w/o hooks so as not to interfere w/ existing hooks
        register("comment", { required: true });
        // clean up on unmount
        return () => unregister("comment");
    }, [unregister]);

    // Utility Component for warnings
    // Will not work correctly as an export only as a nested component.
    // Must have to do with state not being shared.
    // TODO: Look into sharing context
    const FlashErrorMessage = (
        { message, ms, style } : 
        {
            message: string,
            ms: number,
            style: string
        }
    ) => {
        // Tracks how long a form warning message has been displayed
        const [warningHasElapsed, setWarningHasElapsed] = useState(false); 
        
        useTimeout(() => {
            setWarningHasElapsed(true)
        }, ms);
    
    
        // If show is false the component will return null and stop here
        if (warningHasElapsed) {
            return null;
        }
    
        // Otherwise, return warning
        return (
            <span className={style} role="alert">
                <UilExclamationTriangle className="mr-1 h-4"/> {message}
            </span>
        )
    };

    const addComment = (e) => {
        e.preventDefault();
    
        // Return asap if no input
        if (!inputRef.current.value)
        {
            setError(
                "comment", 
                { type: "required", message: "A comment is required."},
                { shouldFocus: true }
            )
            return false; // Whether to addComment or not
        }
    
        // First of all, update last seen entry for the user
        // currently posting a comment
        db.collection("users").doc(user.uid).set(
          {
            lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        ); // Remember to MERGE the content otherwise it will be overwritten!
    
        // Now add a new comment for this post
        let commentData = {
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: inputRef.current.value,
            author: user.username ? user.username : user.email,
            authorUid: user.uid,
            photoURL: user.photoURL ? user.photoURL : avatarURL,
            likes: {}, // This is a map <user.uid, bool> for liked/disliked for each user
            commentUID: uuidv4(), // This is used to uniquely identify the comment, e.g., to remove it
          }
        db.collection("posts")
            .doc(router.query.id)
            .collection("comments")
            .add(commentData)
            .then((doc) => {
                // After posting, check if the user has selected and image to post
                if (imageToPost) {
                    // Funky upload stuff for the image:
                    // take the base64 encoded image and push it to the Firebase storage DB.
                    // Note: this goes in the Storage DB under a folder named posts/[document_id]
                    const uploadTask = storage
                        .ref(`posts/${doc.id}`) // Should we make a sub-dir for comments or treat comments as a type of post?
                        .putString(imageToPost, "data_url");

                    // Remove image preview
                    setImageToPost(null);

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
                                db.collection("posts")
                                    .doc(router.query.id)
                                    .collection("comments")
                                    .doc(doc.id)
                                    .set(
                                        {
                                            postImage: url,
                                        },
                                        { merge: true }
                                    ); // Use merge: true! otherwise it replaces the Post!
                            });
                        }
                    );
                }

                // Store the reference to this comment in the map of comments
                // create by the current user.
                // Why is this needed?
                // If we don't keep track of this we would need to
                // scan the entire collection of posts when retrieving
                // the posts of a given user
                db.collection("users")
                .doc(user.uid)
                .get()
                .then((userDoc) => {
                    let tmp = userDoc.data();

                    // Since comments don't exist as their own colletion but rather as
                    // a sub-collection under individual posts, we must use a map to 
                    // store comments where the key is the comment id and the value 
                    // it points to is the parent post id it resides under. 
                    if ("comments" in tmp) {
                        tmp.comments[doc.id] = router.query.id
                    } else {
                        // Add a new entry
                        let newComments: Map<string, string> = new Map<string, string>();
                        newComments.set(doc.id, router.query.id);
                        tmp["comments"] = newComments; 
                    }

                    userDoc.ref.update(tmp);
                })
                .catch((err) => {console.log(err)})
                });
    
        // Clear the input
        inputRef.current.value = "";

        return true // Return true on a successful submission
      };

    const addImageToPost = (e) => {
        e.preventDefault();
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

    const handleImageUpload = (e) => {
        e.preventDefault();
        // Store the event to reset its state later
        // and allow the user to load the same image twice
        // if needed
        setTargetEvent(e);
        addImageToPost(e);
    }

    const addAndClose = (e) => {
        e.preventDefault();
        const success = addComment(e);
        if (success) {
            closeModal(e);
        }
    }


    return (
        <div className={commentFormClass.form}>
            <div className={commentFormClass.body}>
                <div className={commentFormClass.commentBar}>
                    <form>
                        {isMobile ? 
                        (
                        <textarea 
                            ref={inputRef}
                            className={commentFormClass.commentTextArea}
                            placeholder={placeholder}
                            onKeyPress={preventDefaultOnEnter}
                        />
                        ) : (
                        <input
                            ref={inputRef}
                            className={commentFormClass.commentInput}
                            type="text" 
                            placeholder={placeholder}
                            onKeyPress={preventDefaultOnEnter}
                        />
                        )}
                        
                    </form>
                    {/* Image upload */}
                    {!isMobile && (
                        <button 
                            onClick={() => filePickerRef.current.click()} 
                            className={commentFormClass.imageButton}
                        >
                            <UilImagePlus />
                            <input
                                ref={filePickerRef}
                                onChange={handleImageUpload}
                                type='file'
                                hidden
                            />
                        </button>
                    )}
                </div>
                {!isMobile && (
                    <Button 
                        text="Add"
                        keepText={false}
                        icon={<UilCommentPlus/>}
                        type='submit'
                        onClick={addComment}
                        addStyle={commentFormClass.submitButton}
                    />
                )}      
            </div>
            {/* Warning message on missing question */}
            <div>
                {errors.comment && errors.comment.type === 'required' && (
                    <FlashErrorMessage 
                        message={errors.comment.message}
                        ms={warningTime}
                        style={commentFormClass.formAlert}/>
                )}
            </div>
            {isMobile && (
                <div className={commentFormClass.mobileSubmitDiv}>
                    <button 
                        onClick={() => filePickerRef.current.click()} 
                        className={commentFormClass.imageButton}
                    >
                        <UilImagePlus />
                        <input
                            ref={filePickerRef}
                            onChange={handleImageUpload}
                            type='file'
                            onKeyPress={preventDefaultOnEnter}
                            hidden
                        />
                    </button>
                    <Button 
                        text="Add"
                        keepText={false}
                        icon={<UilCommentPlus/>}
                        type='submit'
                        onClick={addAndClose}
                        addStyle={commentFormClass.submitButton}
                    />
                </div>
            )}
            
            {/* Show preview of the image and click it to remove the image from the post */}
            {imageToPost && (
                <div className={commentFormClass.previewDiv}>
                    <div className={commentFormClass.imagePreview}>
                        <img 
                            className={commentFormClass.image} 
                            src={imageToPost} 
                            alt=''/>
                        <UilTimesCircle 
                            className={commentFormClass.removeImageButton} 
                            onClick={() => setImageToPost(null)} />
                    </div> 
                </div>
            )}
        </div>
    )
};

export default NewCommentForm;
