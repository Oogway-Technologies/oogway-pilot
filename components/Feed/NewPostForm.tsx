import React, { useRef, useState, useEffect }  from 'react';

// Database
import firebase from "firebase/compat/app";
import { auth, db, storage } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

// JSX components
import Button from '../Utils/Button';
import { Dialog } from '@headlessui/react';
import { UilNavigator, UilImagePlus, UilTimesCircle, UilChart } from '@iconscout/react-unicons'
import { Collapse } from '@mui/material';

// Form management
import { useForm } from 'react-hook-form';
import useTimeout from '../../hooks/useTimeout';
import { UilExclamationTriangle } from '@iconscout/react-unicons';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { doc } from 'firebase/firestore';

const postFormStyles = {
    modalDiv: 'flex-col bg-white dark:bg-neutralDark-500',
    dialogTitle: "flex px-2 py-md text-lg font-bold  text-neutral-800 dark:text-neutralDark-50",
    // Form
    form: "flex flex-col p-sm space-y-3 lg:w-136",
    formQuestion: "border-solid border-[1px] border-neutral-300 \
        focus-within:border-primary focus-visible:border-primary active:border-neutral-300\
       rounded-[8px]",
    formQuestionInput: "h-12 bg-transparent w-full max-w-full px-5 focus:outline-none text-sm",
    formDescription: "border-solid border-[1px] border-neutral-300 \
        focus-within:border-primary focus-visible:border-primary active:border-neutral-300\
        alert:border-alert rounded-[8px]",
    formDescriptionInput: "resize-none w-full h-28 bg-transparent flex-grow py-2 px-5\
        focus:outline-none text-sm",
    uploadBar: "inline-flex w-full space-x-3 px-2 pt-md pb-xl",
    formCompareText: "border-solid border-[1px] border-neutral-300 w-36 lg:w-96 xl:w-96 \
        focus-within:border-primary focus-visible:border-primary active:border-neutral-300\
        alert:border-alert rounded-[8px]",
    formAlert: "inline-flex items-center text-sm text-alert dark:text-alert",
    // Media
    previewDiv: "inline-flex px-2 space-x-md",
    imagePreview: "flex flex-col items-center",
    image: "flex rounded-[8px] h-20  object-contain",
    // Button styles
    cancelButton: "rounded-[20px] p-sm w-full justify-center bg-neutral-150 hover:bg-neutral-300\
        text-neutral-700 text-sm font-bold",
    PostButton: "rounded-[20px] p-sm w-full space-x-2 justify-center bg-primary dark:bg-primaryDark\
        hover:bg-primaryActive active:bg-primaryActive dark:hover:bg-primaryActive \
        dark:active:bg-primaryActive text-white font-bold",
    imageButton: "inline-flex p-sm rounded-[20px] text-neutral-700 dark:text-neutralDark-150 \
        hover:font-bold active:font-bold dark:hover:font-bold dark:active:font-bold \
        hover:bg-neutral-50 dark:hover:bg-neutralDark-300 active:bg-primary/20 dark:active:bg-primaryDark/20\
        hover:text-neutral-700 dark:hover:text-neutralDark-150 active:text-primary dark:active:text-primaryDark",
    removeImageButton: "flex my-md cursor-pointer text-neutral-700 hover:text-error",
    compareUpload: "inline-block items-center text-primary dark:text-primaryDark text-sm" 
}


type NewPostProps = {
    closeModal: React.MouseEventHandler<HTMLButtonElement>
    questPlaceholder: string,                               // Placeholder text for question input in form
    descPlaceholder: string                                 // Placeholder text for description input in form
};

const NewPostForm: React.FC<NewPostProps> = ({ closeModal, questPlaceholder, descPlaceholder }) => {
    const [user] = useAuthState(auth);
    const [userData] = useDocumentData(doc(db, "users", user.uid));

    // Form management
    const { register, setError, formState: { errors } } = useForm();
    const warningTime = 3000; // set warning to flash for 3 sec

    useEffect(() => { // Register the form inputs w/o hooks so as not to interfere w/ existing hooks
        register("question", { required: true });
    }, []);
    useEffect(() => {
        register("compare", { required: true });
    }, [])
    
    // The image to post and to display as preview
    const [imageToPost, setImageToPost] = useState(null);

    // This is a trick I need to use to reset the state and allow the user
    // to load the same image twice
    const [targetEvent, setTargetEvent] = useState(null);

    // Track whether comparison form or not
    const [expanded, setExpanded] = useState(false)

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

    // Utility Component for warnings
    // Will not work correctly as an export only as a nested component.
    // Must have to do with state not being shared.
    // TODO: Look into sharing context
    const FlashErrorMessage = ({ message, ms, style } : {message:string, ms:number, style:string}) => {
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

    // Handler Functions
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
            setError(
                "question", 
                { type: "required", message: "A question is required."},
                { shouldFocus: true }
            )
            return false; // Whether to sendPost or not
        }

        if (isMissingDataForComparePost() && !isComparePost())
        {
            setError(
                "compare",
                { 
                    type: "required",
                    message: "You are missing required information to create a compare post."
                },
                { shouldFocus: true }
            )
            return false; // Whether to send post or not
        }

        // Prepare the data to add as a post
        let postData = {
            message: inputRef.current.value,                    // Leaving field name as message even though UI refers to it as a question
            description: descriptionRef.current.value,          // Optional description
            name: userData.username ? userData.username : user.email,   // Change this with username or incognito
            image: userData.photoUrl ? userData.photoUUrl : null,                               // Change this with profile picture or incognito
            uid: user.uid,                                      // uid of the user that created this post
            isCompare: false,                                   // Explicitly flag whether is compare type
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        }

        if (isComparePost())
        {
            // If the current post is a compare post,
            // Turn on isCompare flag and add compare post data structure
            postData.isCompare = true;
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

        return true // Return true on a successful submission
    };

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

    const handleImageUpload = (e) => {
        // Store the event to reset its state later
        // and allow the user to load the same image twice
        // if needed
        setTargetEvent(e);
        addImageToPost(e);
    }

    const handleCompareLeftUpload = (e) => {
        // Store the event to reset its state later
        // and allow the user to load the same image twice
        // if needed
        setTargetEvent(e);
        addImageToCompareLeft(e);
    }

    const handleCompareRightUpload = (e) => {
        // Store the event to reset its state later
        // and allow the user to load the same image twice
        // if needed
        setTargetEvent(e);
        addImageToCompareRight(e);
    }

    const removeImage = (idx) => {
        // Easiest way to generalize image removal during when
        // mapping over array, but doesn't scale well to more than
        // three images
        if (idx === 0) setImageToPost(null);
        else if (idx === 1) setImageToCompareLeft(null);
        else if (idx === 2) setImageToCompareRight(null);
        else return

        if (targetEvent) {
            // Reset the event state so the user can reload
            // the same image twice
            targetEvent.target.value = "";
        }
    };

    const sendAndClose = (e) => {
        e.preventDefault();
        const success = sendPost(e);
        if (success) {
            closeModal(e);
        } 
    }

    const handleCompareClick = () => {
        setExpanded(!expanded);
    }

    return (
        <div className={postFormStyles.modalDiv}>
            <Dialog.Title as="div" className={postFormStyles.dialogTitle}>
                What's your question?
            </Dialog.Title>

            {/* Question form */}
            <form className={postFormStyles.form}>

                {/* Question: required */}
                <div className={postFormStyles.formQuestion}>
                    <input
                        className={postFormStyles.formQuestionInput}
                        type='text'
                        aria-invalid={errors.question ? "true" : "false"}
                        ref={inputRef}
                        placeholder={questPlaceholder}
                    />
                </div>

                {/* Warning message on missing question */}
                {errors.question && errors.question.type === 'required' && (
                    <FlashErrorMessage 
                        message={errors.question.message}
                        ms={warningTime}
                        style={postFormStyles.formAlert}/>
                )}

                {/* Description: not required */}
                <div className={postFormStyles.formDescription}>
                    <textarea
                        ref={descriptionRef}
                        placeholder={descPlaceholder}
                        className={postFormStyles.formDescriptionInput}/>
                </div>
            </form>

            {/* Upload Image OR compare*/}
            <div className={postFormStyles.uploadBar}>

                {/* Upload Image */}
                <button 
                    onClick={() => filePickerRef.current.click()} 
                    className={postFormStyles.imageButton}
                >
                    <UilImagePlus />
                    <input
                        ref={filePickerRef}
                        onChange={handleImageUpload}
                        type='file'
                        hidden
                    />
                </button>

                {/* Trigger compare */}
                <button
                    onClick={handleCompareClick}
                    className={postFormStyles.imageButton}
                    aria-expanded={expanded}
                    aria-label="compare"
                >
                    <UilChart/>
                </button>

            </div>
            
            {/* Show preview of the image and click it to remove the image from the post */}
            {(imageToPost || imageToCompareLeft || imageToCompareRight) && (
                <div className={postFormStyles.previewDiv}>
                    {
                        [imageToPost, imageToCompareLeft, imageToCompareRight].map(
                            (img, idx) => {
                            if (img) {
                                return <div key={idx} className={postFormStyles.imagePreview}>
                                            <img 
                                                className={postFormStyles.image} 
                                                src={img} // Pass image to src
                                                alt=''/>
                                            <UilTimesCircle 
                                                className={postFormStyles.removeImageButton} 
                                                onClick={() => removeImage(idx)} />
                                        </div> 
                            }
                    })
                }
                </div>
            )}

            
            <Collapse in={expanded} timeout="auto" unmountOnExit>
            <div className="flex place-content-between pb-md">
                <div className={postFormStyles.form}>
                    {/* Comparision A */}
                    <div className="inline-flex">
                        { imageToCompareLeft ? (
                            <p className="inline-flex items-center px-md text-neutral-700 dark:text-neutralDark-150">
                            Option 1: <span className="italic ml-2">image selected</span>
                            </p>  
                        ) : (
                            <>
                            {/* Text input A */}
                            <div className={postFormStyles.formCompareText}>
                                <input
                                    className={postFormStyles.formQuestionInput}
                                    type='text'
                                    placeholder='Option 1'
                                    // ref={textCompareLeftRef}
                                    onChange={(e) => {
                                        setTextToCompareLeft(e.target.value)
                                    }}
                                    value={textToCompareLeft}
                                />
                            </div>

                            <p className="inline-flex items-center px-md">or</p>

                            {/* Image input A */}
                            <button 
                                className={postFormStyles.compareUpload}
                                onClick={() => filePickerCompareLeftRef.current.click()}
                            >
                                Upload Image
                                <input
                                    ref={filePickerCompareLeftRef}
                                    onChange={handleCompareLeftUpload}
                                    type='file'
                                    hidden
                                />
                            </button>
                            </>
                        )} 
                    </div>
                    {/* Option B */}
                    <div className="inline-flex">
                        { imageToCompareRight ? (
                            <p className="inline-flex items-center px-md text-neutral-700 dark:text-neutralDark-150">
                            Option 2: <span className="italic ml-2">image selected</span>
                            </p>  
                        ) : (
                            <>
                            <div className={postFormStyles.formCompareText}>
                                {/* Text input B */}
                                <input
                                    className={postFormStyles.formQuestionInput}
                                    // ref={textCompareRightRef}
                                    type='text'
                                    placeholder='Option 2'
                                    onChange={(e) => {
                                        setTextToCompareRight(e.target.value)
                                    }}
                                    value={textToCompareRight}
                                />
                            </div>
                            <p className="inline-flex items-center px-md">or</p>

                            {/* Image input B */}
                            <button 
                                className={postFormStyles.compareUpload}
                                onClick={() => filePickerCompareRightRef.current.click()}
                            >
                                Upload Image
                                <input
                                    ref={filePickerCompareRightRef}
                                    onChange={handleCompareRightUpload}
                                    type='file'
                                    hidden
                                />
                            </button>
                            </>
                        )}
                    </div>
                    {errors.compare && errors.compare.type === 'required' && (
                            <FlashErrorMessage 
                                message={errors.compare.message}
                                ms={warningTime}
                                style={postFormStyles.formAlert}/>
                        )} 
                </div>
            </div>
            </Collapse>

            {/* Cancel / Submit buttons */}
            <div className="inline-flex w-full space-x-3 px-2">
                <Button text="Cancel" keepText={true} icon={null}
                    type='button' 
                    addStyle={postFormStyles.cancelButton}
                    onClick={closeModal}
                />
                <Button text="Post" keepText={true} icon={<UilNavigator/>}
                    type="submit"
                    addStyle={postFormStyles.PostButton}
                    onClick={sendAndClose}/>
            </div>
        </div>
    );
};

NewPostForm.defaultProps = {
    questPlaceholder: "Type your question...",
    descPlaceholder: "Description (optional)"
}

export default NewPostForm;

function useRecoilState(userProfileState: any): [any, any] {
    throw new Error('Function not implemented.');
}
