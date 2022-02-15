import React, {useEffect, useRef, useState} from 'react'

// Database
import {db, storage} from '../../../firebase'
import {addDoc, collection, doc, serverTimestamp, setDoc, updateDoc,} from 'firebase/firestore'
import {getDownloadURL, ref, uploadString} from '@firebase/storage'

// JSX components
import Button from '../../Utils/Button'
import {Dialog} from '@headlessui/react'
import {UilColumns, UilExclamationTriangle, UilImagePlus, UilNavigator, UilTimesCircle,} from '@iconscout/react-unicons'
import {Collapse} from '@mui/material'

// Form management
import {useForm} from 'react-hook-form'
import useTimeout from '../../../hooks/useTimeout'
import {postFormClass} from '../../../styles/feed'

// Recoil states
import {userProfileState} from '../../../atoms/user'
import {useRecoilValue} from 'recoil'

// Other and utilities
import preventDefaultOnEnter from '../../../utils/helpers/preventDefaultOnEnter'

type NewPostProps = {
    closeModal: React.MouseEventHandler<HTMLButtonElement>
    questPlaceholder: string // Placeholder text for question input in form
    descPlaceholder: string // Placeholder text for description input in form
}

const NewPostForm: React.FC<NewPostProps> = ({
    closeModal,
    questPlaceholder,
    descPlaceholder,
}) => {
    const userProfile = useRecoilValue(userProfileState)

    // Form management
    const {
        register,
        setError,
        formState: { errors },
    } = useForm()
    const warningTime = 3000 // set warning to flash for 3 sec

    useEffect(() => {
        // Register the form inputs w/o hooks so as not to interfere w/ existing hooks
        register('question', { required: true })
    }, [])
    useEffect(() => {
        register('compare', { required: true })
    }, [])

    const [loading, setLoading] = useState(false)

    // The image to post and to display as preview
    const [imageToPost, setImageToPost] = useState(null)

    // This is a trick I need to use to reset the state and allow the user
    // to load the same image twice
    const [targetEvent, setTargetEvent] = useState(null)

    // Track whether comparison form or not
    const [expanded, setExpanded] = useState(false)

    // Get a reference to the input text
    const inputRef = useRef(null)

    // Get a reference to the description text
    const descriptionRef = useRef(null)

    // Get a reference for the input image
    const filePickerRef = useRef(null)

    // Ref and data for left and right images
    const [imageToCompareLeft, setImageToCompareLeft] = useState(null)
    const [imageToCompareRight, setImageToCompareRight] = useState(null)
    const [textToCompareLeft, setTextToCompareLeft] = useState('')
    const [textToCompareRight, setTextToCompareRight] = useState('')
    const filePickerCompareLeftRef = useRef(null)
    const filePickerCompareRightRef = useRef(null)

    // Utility Component for warnings
    // Will not work correctly as an export only as a nested component.
    // Must have to do with state not being shared.
    // TODO: Look into sharing context
    const FlashErrorMessage = ({
        message,
        ms,
        style,
    }: {
        message: string
        ms: number
        style: string
    }) => {
        // Tracks how long a form warning message has been displayed
        const [warningHasElapsed, setWarningHasElapsed] = useState(false)

        useTimeout(() => {
            setWarningHasElapsed(true)
        }, ms)

        // If show is false the component will return null and stop here
        if (warningHasElapsed) {
            return null
        }

        // Otherwise, return warning
        return (
            <span className={style} role="alert">
                <UilExclamationTriangle className="mr-1 h-4" /> {message}
            </span>
        )
    }

    // Handler Functions
    const isComparePost = () => {
        // Utility function, returns true if it is a compare post,
        // return false otherwise
        return (
            (imageToCompareLeft && imageToCompareRight) ||
            (textToCompareLeft && textToCompareRight) ||
            (imageToCompareLeft && textToCompareRight) ||
            (textToCompareLeft && imageToCompareRight)
        )
    }

    const isMissingDataForComparePost = () => {
        return (
            (imageToCompareLeft ||
                imageToCompareRight ||
                textToCompareLeft ||
                textToCompareRight) &&
            !isComparePost()
        )
    }

    const sendPost = async (e) => {
        e.preventDefault()

        // If the input is empty, return asap
        if (inputRef && !inputRef.current.value) {
            setError(
                'question',
                { type: 'required', message: 'A question is required.' },
                { shouldFocus: true }
            )
            return false // Whether to sendPost or not
        }

        // If the post is a compare post and not all media is specified, return asap
        if (isMissingDataForComparePost() && !isComparePost()) {
            setError(
                'compare',
                {
                    type: 'required',
                    message:
                        'You are missing required information to create a compare post.',
                },
                { shouldFocus: true }
            )
            return false // Whether to send post or not
        }

        // Avoid spamming the post button while uploading the post to the DB
        if (loading) return
        setLoading(true)

        // Steps:
        // 1) create a post and add to firestore 'posts' collection
        // 2) get the post ID for the newly created post
        // 3) upload the image to firebase storage with the post ID as the file name
        // 4) get the dowanload URL for the image and update the original post with image url

        // Prepare the data to add as a post
        let postData = {
            message: inputRef.current.value, // Leaving field name as message even though UI refers to it as a question
            description: descriptionRef.current.value, // Optional description
            name: userProfile.username, // Change this with username or incognito
            uid: userProfile.uid, // uid of the user that created this post
            isCompare: false, // Explicitly flag whether is compare type
            likes: {}, // This is a map <user.uid, bool> for liked/disliked for each user
            timestamp: serverTimestamp(),
        }

        if (isComparePost()) {
            // If the current post is a compare post,
            // Turn on isCompare flag and add compare post data structure
            postData.isCompare = true
            let compareData = {
                objList: [], // List of objects to compare
                votesObjMapList: [], // List of maps, one for each image in the list
            }
            postData['compare'] = compareData
        }

        // Add the post to the firestore DB and get its ref
        const docRef = await addDoc(collection(db, 'posts'), postData)

        // Add media
        if (imageToPost) {
            // There is one image to upload: get its refernce in the DB
            const imageRef = ref(storage, `posts/${docRef.id}/image`)

            // Upload the image
            await uploadString(imageRef, imageToPost, 'data_url').then(
                async (snapshot) => {
                    // Get the download URL for the image
                    const downloadURL = await getDownloadURL(imageRef)

                    // Update the post with the image URL
                    await updateDoc(doc(db, 'posts', docRef.id), {
                        postImage: downloadURL,
                    })

                    // Remove image preview
                    removeImage(0)
                }
            )
        }

        if (isComparePost()) {
            // This is a compare post and it is slightly more complex than the single image post
            // since now we need to upload two images and/or text to the DB and post
            let mediaObjectList: { type: string; value: string }[] = []
            let votesObjMapList: {}[] = [] // TODO: remove and fix likes

            // Upload the left image, if there is one
            if (imageToCompareLeft) {
                const imageRef = ref(storage, `posts/${docRef.id}/imageLeft`)
                await uploadString(
                    imageRef,
                    imageToCompareLeft,
                    'data_url'
                ).then(async (snapshot) => {
                    // Get the download URL for the image
                    const downloadURL = await getDownloadURL(imageRef)
                    mediaObjectList.push({
                        type: 'image',
                        value: downloadURL,
                    })
                    votesObjMapList.push({})
                })
            }

            // Upload the right image, if there is one
            if (imageToCompareRight) {
                const imageRef = ref(storage, `posts/${docRef.id}/imageRight`)
                await uploadString(
                    imageRef,
                    imageToCompareRight,
                    'data_url'
                ).then(async () => {
                    // Get the download URL for the image
                    const downloadURL = await getDownloadURL(imageRef)
                    mediaObjectList.push({
                        type: 'image',
                        value: downloadURL,
                    })
                    votesObjMapList.push({})
                })
            }

            if (textToCompareLeft) {
                mediaObjectList.push({
                    type: 'text',
                    value: textToCompareLeft,
                })
                votesObjMapList.push({})
            }

            if (textToCompareRight) {
                mediaObjectList.push({
                    type: 'text',
                    value: textToCompareRight,
                })
                votesObjMapList.push({})
            }

            // Update the post with the image URLs and text
            await updateDoc(doc(db, 'posts', docRef.id), {
                compare: {
                    objList: mediaObjectList,
                    votesObjMapList: votesObjMapList,
                },
            })

            // Remove previews
            removeCompareObjects()
        }

        // Store the reference to this post to the list of posts created by the current user
        const userDocRef = doc(db, 'users', userProfile.uid)
        setDoc(
            userDocRef,
            {
                posts: { id: docRef.id },
            },
            { merge: true }
        )

        // Everything is done
        setLoading(false)
        if (inputRef.current) {
            inputRef.current.value = ''
        }

        return true
    }

    const addImageToCompareLeft = (e) => {
        const reader = new FileReader()
        if (e.target.files[0]) {
            // Read the file
            reader.readAsDataURL(e.target.files[0])
        }

        // Reader is async, so use onload to attach a function
        // to set the loaded image from the reader
        reader.onload = (readerEvent) => {
            setImageToCompareLeft(readerEvent.target.result)
            if (targetEvent) {
                // Reset the event state so the user can reload
                // the same image twice
                targetEvent.target.value = ''
            }
        }
    }

    const addImageToCompareRight = (e) => {
        const reader = new FileReader()
        if (e.target.files[0]) {
            // Read the file
            reader.readAsDataURL(e.target.files[0])
        }

        // Reader is async, so use onload to attach a function
        // to set the loaded image from the reader
        reader.onload = (readerEvent) => {
            setImageToCompareRight(readerEvent.target.result)
            if (targetEvent) {
                // Reset the event state so the user can reload
                // the same image twice
                targetEvent.target.value = ''
            }
        }
    }

    const addImageToPost = (e) => {
        const reader = new FileReader()
        if (e.target.files[0]) {
            // Read the file
            reader.readAsDataURL(e.target.files[0])
        }

        // Reader is async, so use onload to attach a function
        // to set the loaded image from the reader
        reader.onload = (readerEvent) => {
            setImageToPost(readerEvent.target.result)
            if (targetEvent) {
                // Reset the event state so the user can reload
                // the same image twice
                targetEvent.target.value = ''
            }
        }
    }

    const removeCompareObjects = () => {
        setImageToCompareLeft(null)
        setImageToCompareRight(null)
        setTextToCompareLeft('')
        setTextToCompareRight('')
        if (targetEvent) {
            targetEvent.target.value = ''
        }
    }

    const handleImageUpload = (e) => {
        // Store the event to reset its state later
        // and allow the user to load the same image twice
        // if needed
        setTargetEvent(e)
        addImageToPost(e)
    }

    const handleCompareLeftUpload = (e) => {
        // Store the event to reset its state later
        // and allow the user to load the same image twice
        // if needed
        setTargetEvent(e)
        addImageToCompareLeft(e)
    }

    const handleCompareRightUpload = (e) => {
        // Store the event to reset its state later
        // and allow the user to load the same image twice
        // if needed
        setTargetEvent(e)
        addImageToCompareRight(e)
    }

    const removeImage = (idx) => {
        // Easiest way to generalize image removal during when
        // mapping over array, but doesn't scale well to more than
        // three images
        if (idx === 0) setImageToPost(null)
        else if (idx === 1) setImageToCompareLeft(null)
        else if (idx === 2) setImageToCompareRight(null)
        else return

        if (targetEvent) {
            // Reset the event state so the user can reload
            // the same image twice
            targetEvent.target.value = ''
        }
    }

    const sendAndClose = async (e) => {
        e.preventDefault()
        const success = sendPost(e)
        if (await success) {
            closeModal(e)
        }
    }

    const handleCompareClick = () => {
        setExpanded(!expanded)
    }

    const handleKeyPress = (e) => {
        // Trigger on enter key
        if (e.keyCode === 13) {
            sendAndClose(e)
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
                        type="text"
                        aria-invalid={errors.question ? 'true' : 'false'}
                        ref={inputRef}
                        placeholder={questPlaceholder}
                        onKeyPress={preventDefaultOnEnter}
                    />
                </div>

                {/* Warning message on missing question */}
                {errors.question && errors.question.type === 'required' && (
                    <FlashErrorMessage
                        message={errors.question.message}
                        ms={warningTime}
                        style={postFormClass.formAlert}
                    />
                )}

                {/* Description: not required */}
                <div className={postFormClass.formDescription}>
                    <textarea
                        ref={descriptionRef}
                        placeholder={descPlaceholder}
                        className={postFormClass.formDescriptionInput}
                        onKeyPress={preventDefaultOnEnter}
                    />
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
                        type="file"
                        onKeyPress={preventDefaultOnEnter}
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
                    <UilColumns />
                </button>
            </div>

            {/* Show preview of the image and click it to remove the image from the post */}
            {(imageToPost || imageToCompareLeft || imageToCompareRight) && (
                <div className={postFormClass.previewDiv}>
                    {[imageToPost, imageToCompareLeft, imageToCompareRight].map(
                        (img, idx) => {
                            if (img) {
                                return (
                                    <div
                                        key={idx}
                                        className={postFormClass.imagePreview}
                                    >
                                        <img
                                            className={postFormClass.image}
                                            src={img} // Pass image to src
                                            alt=""
                                        />
                                        <UilTimesCircle
                                            className={
                                                postFormClass.removeImageButton
                                            }
                                            onClick={() => removeImage(idx)}
                                        />
                                    </div>
                                )
                            }
                        }
                    )}
                </div>
            )}

            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <div className={postFormClass.imageComparisonDiv}>
                    <div className={postFormClass.form}>
                        {/* Comparision A */}
                        <div className="inline-flex">
                            {imageToCompareLeft ? (
                                <p className={postFormClass.imageSelectedText}>
                                    Option 1:{' '}
                                    <span
                                        className={
                                            postFormClass.imageSelectedSpan
                                        }
                                    >
                                        image selected
                                    </span>
                                </p>
                            ) : (
                                <>
                                    {/* Text input A */}
                                    <div
                                        className={
                                            postFormClass.formCompareText
                                        }
                                    >
                                        <input
                                            className={
                                                postFormClass.formQuestionInput
                                            }
                                            type="text"
                                            placeholder="Option 1"
                                            onKeyPress={preventDefaultOnEnter}
                                            onChange={(e) => {
                                                setTextToCompareLeft(
                                                    e.target.value
                                                )
                                            }}
                                            value={textToCompareLeft}
                                        />
                                    </div>

                                    <p className={postFormClass.orText}>or</p>

                                    {/* Image input A */}
                                    <button
                                        className={postFormClass.compareUpload}
                                        onClick={() =>
                                            filePickerCompareLeftRef.current.click()
                                        }
                                    >
                                        Upload Image
                                        <input
                                            ref={filePickerCompareLeftRef}
                                            onChange={handleCompareLeftUpload}
                                            type="file"
                                            onKeyPress={preventDefaultOnEnter}
                                            hidden
                                        />
                                    </button>
                                </>
                            )}
                        </div>
                        {/* Option B */}
                        <div className="inline-flex">
                            {imageToCompareRight ? (
                                <p className={postFormClass.imageSelectedText}>
                                    Option 2:{' '}
                                    <span
                                        className={
                                            postFormClass.imageSelectedSpan
                                        }
                                    >
                                        image selected
                                    </span>
                                </p>
                            ) : (
                                <>
                                    <div
                                        className={
                                            postFormClass.formCompareText
                                        }
                                    >
                                        {/* Text input B */}
                                        <input
                                            className={
                                                postFormClass.formQuestionInput
                                            }
                                            // ref={textCompareRightRef}
                                            type="text"
                                            placeholder="Option 2"
                                            onKeyPress={preventDefaultOnEnter}
                                            onChange={(e) => {
                                                setTextToCompareRight(
                                                    e.target.value
                                                )
                                            }}
                                            value={textToCompareRight}
                                        />
                                    </div>
                                    <p className={postFormClass.orText}>or</p>

                                    {/* Image input B */}
                                    <button
                                        className={postFormClass.compareUpload}
                                        onClick={() =>
                                            filePickerCompareRightRef.current.click()
                                        }
                                    >
                                        Upload Image
                                        <input
                                            ref={filePickerCompareRightRef}
                                            onChange={handleCompareRightUpload}
                                            type="file"
                                            onKeyPress={preventDefaultOnEnter}
                                            hidden
                                        />
                                    </button>
                                </>
                            )}
                        </div>
                        {errors.compare &&
                            errors.compare.type === 'required' && (
                                <FlashErrorMessage
                                    message={errors.compare.message}
                                    ms={warningTime}
                                    style={postFormClass.formAlert}
                                />
                            )}
                    </div>
                </div>
            </Collapse>

            {/* Cancel / Submit buttons */}
            <div className={postFormClass.cancelSubmitDiv}>
                <Button
                    text="Cancel"
                    keepText={true}
                    icon={null}
                    type="button"
                    addStyle={postFormClass.cancelButton}
                    onClick={closeModal}
                />
                <Button
                    text="Post"
                    keepText={true}
                    icon={<UilNavigator />}
                    type="submit"
                    addStyle={postFormClass.PostButton}
                    onClick={sendAndClose}
                    onKeyPress={handleKeyPress}
                />
            </div>
        </div>
    )
}

NewPostForm.defaultProps = {
    questPlaceholder: 'Type your question...',
    descPlaceholder: 'Description (optional)',
}

export default NewPostForm
