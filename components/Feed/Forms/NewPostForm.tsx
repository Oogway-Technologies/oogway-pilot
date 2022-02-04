import React, { useRef, useState, useEffect }  from 'react';

// Database
import firebase from "firebase/compat/app";
import { auth, db, storage } from "../../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

// JSX components
import Button from '../../Utils/Button';
import { Dialog } from '@headlessui/react';
import { UilNavigator, UilImagePlus, UilTimesCircle, UilChart } from '@iconscout/react-unicons'
import { Collapse } from '@mui/material';

// Form management
import { useForm } from 'react-hook-form';
import useTimeout from '../../../hooks/useTimeout';
import { UilExclamationTriangle } from '@iconscout/react-unicons';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { doc } from 'firebase/firestore';
import { postFormClass } from '../../../styles/feed';

// Other and utilities
import cryptoRandomString from 'crypto-random-string';

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

    const addCompareTextToPostSync = (textList, doc) => {
        if (textList.length > 0) {
            let text = textList[0];

            // Remove the first element (currently being used)
            textList.shift();

            doc.get()
            .then((docSnapshot) => {
                let tmp = docSnapshot.data();
                let obj = {
                    type: "text",
                    value: text,
                }
                
                tmp.compare['objList'].push(obj); 
                tmp.compare['votesObjMapList'].push({});

                doc.update(tmp)
                .then(() => {
                    // Recursively call the same function for the other
                    // text to upload when the current upload is done
                    addCompareTextToPostSync(textList, doc);
                })
            })

        }
    };

    const addCompareDataToPostSync = (uploadTaskList, doc) => {
        if (uploadTaskList.length > 0) {
            let uploadTaskPair = uploadTaskList[0];

            // Remove the first element (currently being used)
            uploadTaskList.shift();

            uploadTaskPair[0].on(
                'state_changed',
                null,
                (error) => console.log(error),
                () => {
                    // When the uploads completes, add the image to the post
                    storage
                    .ref(uploadTaskPair[1])
                    .getDownloadURL()
                    .then((url) => {
                        doc.get()
                        .then((docSnapshot) => {
                            let tmp = docSnapshot.data();
                            let obj = {
                                type: "image",
                                value: url,
                            }
                            
                            tmp.compare['objList'].push(obj); 
                            tmp.compare['votesObjMapList'].push({});
                            doc.update(tmp)
                            .then(() => {
                                // Recursively call the same function for the other
                                // media to upload when the current upload is done
                                addCompareDataToPostSync(uploadTaskList, doc);
                            })
                        })
                    })
                }
            );
        }
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
            message: inputRef.current.value,                            // Leaving field name as message even though UI refers to it as a question
            description: descriptionRef.current.value,                  // Optional description
            name: userData.username ? userData.username : user.email,   // Change this with username or incognito
            image: userData.photoUrl ? userData.photoUUrl : null,       // Change this with profile picture or incognito
            uid: user.uid,                                              // uid of the user that created this post
            isCompare: false,                                           // Explicitly flag whether is compare type
            likes: {}, // This is a map <user.uid, bool> for liked/disliked for each user
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
                let uploadTaskList = [];
                let uploadTextList = [];
                if (imageToCompareLeft) {
                    const rndName = cryptoRandomString({length: 10});
                    const mediaAddr = `posts/${doc.id}/${rndName}`;
                    const uploadTaskLeft = storage
                    .ref(mediaAddr)
                    .putString(imageToCompareLeft, "data_url");

                    // Add compare data to the post
                    uploadTaskList.push([uploadTaskLeft, mediaAddr]);
                    //addCompareDataToPost(uploadTaskLeft, doc);
    
                }

                if (imageToCompareRight) {
                    const rndName = cryptoRandomString({length: 10});
                    const mediaAddr = `posts/${doc.id}/${rndName}`;
                    const uploadTaskRight = storage
                    .ref(mediaAddr)
                    .putString(imageToCompareRight, "data_url");


                    // Add compare data to the post
                    //addCompareDataToPost(uploadTaskRight, doc);
                    uploadTaskList.push([uploadTaskRight, mediaAddr]);
                }

                if (textToCompareLeft) {
                    uploadTextList.push(textToCompareLeft);
                }

                if (textToCompareRight) {
                    uploadTaskList.push(textToCompareRight);
                }

                // Upload all media into the post doc
                addCompareDataToPostSync(uploadTaskList, doc);

                // Upload all text into the post doc
                addCompareTextToPostSync(uploadTextList, doc);

                // Remove image preview
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

    const handleKeyPress = (e) => {
        // Trigger on enter key
        if (e.keyCode === 13) {
            sendAndClose(e);
        }
    }

    return (
        <div className={postFormClass.modalDiv}>
            <Dialog.Title as="div" className={postFormClass.dialogTitle}>
                What's your question?
            </Dialog.Title>

            {/* Question form */}
            <form className={postFormClass.form}>

                {/* Question: required */}
                <div className={postFormClass.formQuestion}>
                    <input
                        className={postFormClass.formQuestionInput}
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
                        style={postFormClass.formAlert}/>
                )}

                {/* Description: not required */}
                <div className={postFormClass.formDescription}>
                    <textarea
                        ref={descriptionRef}
                        placeholder={descPlaceholder}
                        className={postFormClass.formDescriptionInput}/>
                </div>
            </form>

            {/* Upload Image OR compare*/}
            <div className={postFormClass.uploadBar}>

                {/* Upload Image */}
                <button 
                    onClick={() => filePickerRef.current.click()} 
                    className={postFormClass.imageButton}
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
                    className={postFormClass.imageButton}
                    aria-expanded={expanded}
                    aria-label="compare"
                >
                    <UilChart/>
                </button>

            </div>
            
            {/* Show preview of the image and click it to remove the image from the post */}
            {(imageToPost || imageToCompareLeft || imageToCompareRight) && (
                <div className={postFormClass.previewDiv}>
                    {
                        [imageToPost, imageToCompareLeft, imageToCompareRight].map(
                            (img, idx) => {
                            if (img) {
                                return <div key={idx} className={postFormClass.imagePreview}>
                                            <img 
                                                className={postFormClass.image} 
                                                src={img} // Pass image to src
                                                alt=''/>
                                            <UilTimesCircle 
                                                className={postFormClass.removeImageButton} 
                                                onClick={() => removeImage(idx)} />
                                        </div> 
                            }
                    })
                }
                </div>
            )}

            
            <Collapse in={expanded} timeout="auto" unmountOnExit>
            <div className={postFormClass.imageComparisonDiv}>
                <div className={postFormClass.form}>
                    {/* Comparision A */}
                    <div className="inline-flex">
                        { imageToCompareLeft ? (
                            <p className={postFormClass.imageSelectedText}>
                            Option 1: <span className={postFormClass.imageSelectedSpan}>image selected</span>
                            </p>  
                        ) : (
                            <>
                            {/* Text input A */}
                            <div className={postFormClass.formCompareText}>
                                <input
                                    className={postFormClass.formQuestionInput}
                                    type='text'
                                    placeholder='Option 1'
                                    // ref={textCompareLeftRef}
                                    onChange={(e) => {
                                        setTextToCompareLeft(e.target.value)
                                    }}
                                    value={textToCompareLeft}
                                />
                            </div>

                            <p className={postFormClass.orText}>or</p>

                            {/* Image input A */}
                            <button 
                                className={postFormClass.compareUpload}
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
                            <p className={postFormClass.imageSelectedText}>
                            Option 2: <span className={postFormClass.imageSelectedSpan}>image selected</span>
                            </p>  
                        ) : (
                            <>
                            <div className={postFormClass.formCompareText}>
                                {/* Text input B */}
                                <input
                                    className={postFormClass.formQuestionInput}
                                    // ref={textCompareRightRef}
                                    type='text'
                                    placeholder='Option 2'
                                    onChange={(e) => {
                                        setTextToCompareRight(e.target.value)
                                    }}
                                    value={textToCompareRight}
                                />
                            </div>
                            <p className={postFormClass.orText}>or</p>

                            {/* Image input B */}
                            <button 
                                className={postFormClass.compareUpload}
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
                                style={postFormClass.formAlert}/>
                        )} 
                </div>
            </div>
            </Collapse>

            {/* Cancel / Submit buttons */}
            <div className={postFormClass.cancelSubmitDiv}>
                <Button text="Cancel" keepText={true} icon={null}
                    type='button' 
                    addStyle={postFormClass.cancelButton}
                    onClick={closeModal}
                />
                <Button text="Post" keepText={true} icon={<UilNavigator/>}
                    type="submit"
                    addStyle={postFormClass.PostButton}
                    onClick={sendAndClose}
                    onKeyPress={handleKeyPress}/>
        </div>
        </div>
    );
};

NewPostForm.defaultProps = {
    questPlaceholder: "Type your question...",
    descPlaceholder: "Description (optional)"
}

export default NewPostForm;