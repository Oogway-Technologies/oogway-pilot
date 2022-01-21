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

    // Ref and data for left and right images
    const [imageToCompareLeft, setImageToCompareLeft] = useState(null);
    const [imageToCompareRight, setImageToCompareRight] = useState(null);
    const [textToCompareLeft, setTextToCompareLeft] = useState('');
    const [textToCompareRight, setTextToCompareRight] = useState('');
    const filePickerCompareLeftRef = useRef(null);
    const filePickerCompareRightRef = useRef(null);

    const isComparePost = () => {
        // Utility function, returns true if it is a compare post,
        // return false otherwise
        return (imageToCompareLeft && imageToCompareRight) ||
        (textToCompareLeft && textToCompareRight) ||
        (imageToCompareLeft && textToCompareRight) || 
        (textToCompareLeft && imageToCompareRight);
    }

    const isMissingDataForComparePost = () => {
        return (imageToCompareLeft || imageToCompareRight || 
        textToCompareLeft || textToCompareRight) && (!isComparePost());
    }

    const addCompareTextToPost = (text, doc) => {
        var docRef = db.collection("posts").doc(doc.id);

        return db
        .runTransaction((transaction) => {
            return transaction.get(docRef).then((doc) => {
                let tmp = doc.data();
                let obj = {
                    type: "text",
                    value: text,
                }
                
                tmp.compare['objList'].push(obj); 
                tmp.compare['votesObjMapList'].push({});
                transaction.update(docRef, tmp);

            })
        })
    };

    const addCompareDataToPost = (uploadTask, doc) => {
        uploadTask.on(
            "state_change",
            null,
            (error) => console.error(error),
            () => {
                // When the uploads completes, add the image to the post
                storage
                .ref("posts")
                .child(doc.id)
                .getDownloadURL()
                .then((url) => {
                    var docRef = db.collection("posts").doc(doc.id);
                    return db
                    .runTransaction((transaction) => {
                        return transaction.get(docRef).then((doc) => {
                            let tmp = doc.data();
                            
                            // Create a new object to compare
                            let obj = {
                                type: "image",
                                value: url,
                            }
                            tmp.compare['objList'].push(obj);         // Add the object to compare
                            tmp.compare['votesObjMapList'].push({});  // Add its corresponding voting map.
                                                                      // Ideally this would be a Set of the 
                                                                      // users' uid voting for that post, instead
                                                                      // of a map of <uid, some_data_not_important>
                                                                      // However, Firebase doesn't support Set datatypes
                            transaction.update(docRef, tmp);
                        })
                    })
                });
            }
        );
    };

    const sendPost = (e) => {
        e.preventDefault();

        // If the input is empty, return asap
        if (!inputRef.current.value)
        {
            alert("Please, type a message");
            return;
        }

        if (isMissingDataForComparePost() && !isComparePost())
        {
            alert("Please, add all the information to creeate a compare post");
            return;
        }

        // Prepare the data to add as a post
        let postData = {
            message: inputRef.current.value,
            name: user.name ? user.name : user.email,   // Change this with username or incognito
            image: user.photoURL,                       // Change this with profile picture or incognito
            uid: user.uid,                              // uid of the user that created this post
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        }

        if (isComparePost())
        {
            // If the current post is a compare post,
            // add compare post data structure
            let compareData = {
                objList: [],          // List of objects to compare
                votesObjMapList: [],  // List of maps, one for each image in the list
            };
            postData["compare"] = compareData;
        }

        // Add a post to the posts collection
        db.collection("posts")
            .add(postData)
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
            else if (isComparePost())
            {
                // This is a compare post
                if (imageToCompareLeft) {
                    const uploadTaskLeft = storage
                    .ref(`posts/${doc.id}`)
                    .putString(imageToCompareLeft, "data_url");

                    // Add compare data to the post
                    addCompareDataToPost(uploadTaskLeft, doc);
    
                }

                if (imageToCompareRight) {
                    const uploadTaskRight = storage
                    .ref(`posts/${doc.id}`)
                    .putString(imageToCompareRight, "data_url");


                    // Add compare data to the post
                    addCompareDataToPost(uploadTaskRight, doc);
                }

                if (textToCompareLeft) {
                    console.log("ADD LEFT TEXT", textToCompareLeft)
                    addCompareTextToPost(textToCompareLeft, doc);
                }

                if (textToCompareRight) {
                    console.log("ADD RIGHT TEXT", textToCompareRight)
                    addCompareTextToPost(textToCompareRight, doc);
                }

                removeCompareObjects();
            }

            // Store the reference to this post to the list of posts
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

            if ("posts" in tmp) {
                tmp.posts.push(doc.id)
            } else {
                // Add a new entry
                tmp["posts"] = [doc.id]
            }

            userDoc.ref.update(tmp);
        })
        .catch((err) => {console.log(err)})
            
        });

        // Clear the input
        inputRef.current.value = "";
    };

    // Helper functions
    const addImageToCompareLeft = (e) => {
        const reader = new FileReader();
        if (e.target.files[0]) {
            // Read the file
            reader.readAsDataURL(e.target.files[0]);
        }

        // Reader is async, so use onload to attach a function
        // to set the loaded image from the reader
        reader.onload = (readerEvent) => {
            setImageToCompareLeft(readerEvent.target.result);
            if (targetEvent) {
            // Reset the event state so the user can reload
            // the same image twice
            targetEvent.target.value = "";
            }
        };
    };

    const addImageToCompareRight = (e) => {
        const reader = new FileReader();
        if (e.target.files[0]) {
            // Read the file
            reader.readAsDataURL(e.target.files[0]);
        }

        // Reader is async, so use onload to attach a function
        // to set the loaded image from the reader
        reader.onload = (readerEvent) => {
            setImageToCompareRight(readerEvent.target.result);
            if (targetEvent) {
            // Reset the event state so the user can reload
            // the same image twice
            targetEvent.target.value = "";
            }
        };
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

    const removeCompareObjects = () => {
        setImageToCompareLeft(null);
        setImageToCompareRight(null);
        setTextToCompareLeft("");
        setTextToCompareRight("");
        if (targetEvent) {
            targetEvent.target.value = "";
        }
    }

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

            {/* DELETE ALL THE FOLLOWING UPLOADS AND KEEP ONLY APIs. THIS IS ONLY FOR TESTING APIs! */}
            <div className="flex place-content-between p-10">
                <div>
                    <button className="text-gray-800 text-sm bg-gray-200 p-3 ring-red-800
                    rounded-md hover:ring-2 focus:outline-none"
                    onClick={() => filePickerCompareLeftRef.current.click()}>
                        Load Image 1
                    </button>
                    <input
                        ref={filePickerCompareLeftRef}
                        onChange={(e) => {
                            // Store the event to reset its state later
                            // and allow the user to load the same image twice
                            // if needed
                            setTargetEvent(e);
                            addImageToCompareLeft(e);
                        }}
                        type='file'
                        hidden
                    />
                    <p className="text-xs">{imageToCompareLeft ? "Image left Loaded" : ""}</p>
                </div>
            
                <div>
                    <button className="text-gray-800 text-sm bg-gray-200 p-3 ring-blue-800
                    rounded-md hover:ring-2 focus:outline-none"
                    onClick={() => filePickerCompareRightRef.current.click()}>
                        Load Image 2
                    </button>
                    <input
                        ref={filePickerCompareRightRef}
                        onChange={(e) => {
                            // Store the event to reset its state later
                            // and allow the user to load the same image twice
                            // if needed
                            setTargetEvent(e);
                            addImageToCompareRight(e);
                        }}
                        type='file'
                        hidden
                    />
                    <p className="text-xs">{imageToCompareRight ? "Image right Loaded" : ""}</p>
                </div>
            </div>

            <div className="flex place-content-between p-10">
            <div className='flex flex-col items-center'>
                    <p className="text-white">Text Left</p>
                    <input
                        onChange={(e) => {
                            setTextToCompareLeft(e.target.value)
                        }}
                        value={textToCompareLeft}
                        className="mt-1 w-2/3 rounded-md"
                        type='text'
                    />
                    <p className="text-xs">{imageToCompareRight ? "Text left Loaded" : ""}</p>
            </div>
            <div className='flex flex-col items-center'>
            <p className="text-white">Text Right</p>
                    <input
                    className="mt-1 w-2/3 rounded-md"
                    type='text'
                    onChange={(e) => {
                        setTextToCompareRight(e.target.value)
                    }}
                    value={textToCompareRight}
                    />
                    <p className="text-xs">{imageToCompareRight ? "Text right Loaded" : ""}</p>
            </div>
            </div>




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
