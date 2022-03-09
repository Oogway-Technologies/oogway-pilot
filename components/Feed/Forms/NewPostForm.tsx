import React, {
    ChangeEvent,
    FC,
    KeyboardEvent,
    MouseEvent,
    useEffect,
    useRef,
    useState,
} from 'react'

// Database
import { db, storage } from '../../../firebase'
import {
    addDoc,
    collection,
    doc,
    serverTimestamp,
    setDoc,
    updateDoc,
} from 'firebase/firestore'
import { getDownloadURL, ref, uploadString } from '@firebase/storage'

// JSX components
import Button from '../../Utils/Button'
import { Dialog } from '@headlessui/react'
import {
    UilBalanceScale,
    UilImagePlus,
    UilNavigator,
    UilTimesCircle,
    // @ts-ignore
} from '@iconscout/react-unicons'

import { Collapse } from '@mui/material'

// Form management
import { useForm } from 'react-hook-form'
import { postFormClass } from '../../../styles/feed'

// Recoil states
import { userProfileState } from '../../../atoms/user'
import { useRecoilValue } from 'recoil'

// Other and utilities
import preventDefaultOnEnter from '../../../utils/helpers/preventDefaultOnEnter'
import { FirebasePost } from '../../../utils/types/firebase'

// Queries
import { useQueryClient } from 'react-query'
import { Tooltip } from '../../Utils/Tooltip'
import {
    checkFileSize,
    fetcher,
    isValidURL,
} from '../../../utils/helpers/common'
import FlashErrorMessage from '../../Utils/FlashErrorMessage'
import {
    longLimit,
    shortLimit,
    warningTime,
} from '../../../utils/constants/global'
import { MediaObject } from '../../../utils/types/global'
import ToggleIncognito from '../Post/ToggleIncognito'

type NewPostProps = {
    closeModal: () => void
    questPlaceholder?: string // Placeholder text for question input in form
    descPlaceholder?: string // Placeholder text for description input in form
}

const NewPostForm: FC<NewPostProps> = ({
    closeModal,
    questPlaceholder,
    descPlaceholder,
}) => {
    // Track current user profile data
    const userProfile = useRecoilValue(userProfileState)

    // For triggering posts refetch on form submission
    const queryClient = useQueryClient()

    // Form management
    const {
        register,
        setError,
        formState: { errors },
        clearErrors,
    } = useForm()
    useEffect(() => {
        // Register the form inputs w/o hooks so as not to interfere w/ existing hooks
        register('question', { required: true })
    }, [])
    useEffect(() => {
        register('compare', { required: true })
    }, [])

    const [loading, setLoading] = useState(false)

    // The image to post and to display as preview
    const [imageToPost, setImageToPost] = useState<
        string | ArrayBuffer | null | undefined
    >(null)

    // This is a trick I need to use to reset the state and allow the user
    // to load the same image twice
    const [targetEvent, setTargetEvent] =
        useState<ChangeEvent<HTMLInputElement>>()

    // Track whether comparison form or not
    const [expanded, setExpanded] = useState<boolean>(false)

    // Get a reference to the input text
    const inputRef = useRef<HTMLInputElement>(null)

    // Get a reference to the description text
    const descriptionRef = useRef<HTMLTextAreaElement>(null)

    // Get a reference for the input image
    const filePickerRef = useRef<HTMLInputElement>(null)

    // Track whether user has opted to post anonymously
    const [isIncognito, setIsIncognito] = useState<boolean>(false)

    // Ref and data for left and right images
    const [imageToCompareLeft, setImageToCompareLeft] = useState<
        string | ArrayBuffer | null | undefined
    >(null)
    const [imageToCompareRight, setImageToCompareRight] = useState<
        string | ArrayBuffer | null | undefined
    >(null)
    const [textToCompareLeft, setTextToCompareLeft] = useState<string>('')
    const [textToCompareRight, setTextToCompareRight] = useState<string>('')
    const filePickerCompareLeftRef = useRef<HTMLInputElement>(null)
    const filePickerCompareRightRef = useRef<HTMLInputElement>(null)
    const [previewImage, setPreviewImage] = useState<string>('')
    const [leftComparePreviewImage, setLeftComparePreviewImage] =
        useState<string>('')
    const [rightComparePreviewImage, setRightComparePreviewImage] =
        useState<string>('')
    const [isImageSizeLarge, setIsImageSizeLarge] = useState<boolean>(false)
    const [isTitleURL, setIsTitleURL] = useState<boolean>(false)

    //Processing the images received from backend for description field
    const previewImagecallBack = async (res: string[]) => {
        if (res.length > 0) {
            setPreviewImage(res[0])
        } else {
            setPreviewImage(' ')
        }
    }

    //Processing the images received from backend for left compare Link field
    const leftComparePreviewImagecallBack = async (res: string[]) => {
        if (res.length > 0) {
            setLeftComparePreviewImage(res[0])
        } else {
            setLeftComparePreviewImage(' ')
        }
    }

    //Processing the images received from backend for right compare Link field
    const rightComparePreviewImagecallBack = async (res: string[]) => {
        if (res.length > 0) {
            setRightComparePreviewImage(res[0])
        } else {
            setRightComparePreviewImage(' ')
        }
    }

    useEffect(() => {
        if (previewImage) {
            ;(async () => {
                await sendPost()
            })()
        }
    }, [previewImage])

    const checkPreviewImage = (url: string) => {
        return fetcher(`/api/fetchPreviewData?urlToHit=${url}`)
    }

    // Utility Component for warnings
    // Will not work correctly as an export only as a nested component.
    // Must have to do with state not being shared.

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

    const validateForm = () => {
        // If the input is empty, return asap
        let questionProvided = true
        if (inputRef && !inputRef?.current?.value.trim()) {
            setError(
                'question',
                { type: 'required', message: 'A question is required.' },
                { shouldFocus: true }
            )
            questionProvided = false
        }

        // If the post is a compare post and not all media is specified, return asap
        let questionHasMedia = true
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
            questionHasMedia = false
        }
        if (!questionProvided || !questionHasMedia) {
            setTimeout(() => clearErrors(), 3000)
        }

        // Whether to sendPost or not
        return questionProvided && questionHasMedia && !isTitleURL
    }

    const sendPost = async () => {
        // Avoid spamming the post button while uploading the post to the DB
        if (loading) return
        setLoading(true)

        // Steps:
        // 1) create a post and add to firestore 'posts' collection
        // 2) get the post ID for the newly created post
        // 3) upload the image to firebase storage with the post ID as the file name
        // 4) get the dowanload URL for the image and update the original post with image url

        // Prepare the data to add as a post
        let postData: FirebasePost = {
            message: inputRef?.current?.value || '', // Leaving field name as message even though UI refers to it as a question
            description: descriptionRef?.current?.value || '', // Optional description
            previewImage: previewImage, // Saves preview Image from Link
            name: userProfile.username, // Change this with username or incognito
            uid: userProfile.uid, // uid of the user that created this post
            isCompare: false, // Explicitly flag whether is compare type
            likes: {}, // This is a map <user.uid, bool> for liked/disliked for each user
            timestamp: serverTimestamp(),
            isAnonymous: isIncognito,
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
            await uploadString(
                imageRef,
                imageToPost as string,
                'data_url'
            ).then(async () => {
                // Get the download URL for the image
                const downloadURL = await getDownloadURL(imageRef)

                // Update the post with the image URL
                await updateDoc(doc(db, 'posts', docRef.id), {
                    postImage: downloadURL,
                })

                // Remove image preview
                removeImage(0)
            })
        }

        if (isComparePost()) {
            // This is a compare post and it is slightly more complex than the single image post
            // since now we need to upload two images and/or text to the DB and post
            //let mediaObjectList: { type: string; value: string }[] = []
            let leftMediaObject: MediaObject = {
                text: '',
                image: '',
                previewImage: '',
            }
            let rightMediaObject: MediaObject = {
                text: '',
                image: '',
                previewImage: '',
            }
            let mediaObjectList: MediaObject[] = []
            let votesObjMapList: {}[] = [] // TODO: remove and fix likes

            // Upload the left image, if there is one
            if (imageToCompareLeft) {
                const imageRef = ref(storage, `posts/${docRef.id}/imageLeft`)
                await uploadString(
                    imageRef,
                    imageToCompareLeft as string,
                    'data_url'
                ).then(async () => {
                    // Get the download URL for the image
                    const downloadURL = await getDownloadURL(imageRef)
                    leftMediaObject.image = downloadURL
                    votesObjMapList.push({})
                })
            } else {
                leftMediaObject.previewImage = leftComparePreviewImage
            }

            // Upload the right image, if there is one
            if (imageToCompareRight) {
                const imageRef = ref(storage, `posts/${docRef.id}/imageRight`)
                await uploadString(
                    imageRef,
                    imageToCompareRight as string,
                    'data_url'
                ).then(async () => {
                    // Get the download URL for the image
                    const downloadURL = await getDownloadURL(imageRef)
                    rightMediaObject.image = downloadURL
                    votesObjMapList.push({})
                })
            } else {
                rightMediaObject.previewImage = rightComparePreviewImage
            }

            if (textToCompareLeft) {
                leftMediaObject.text = textToCompareLeft
                votesObjMapList.push({})
            }

            if (textToCompareRight) {
                rightMediaObject.text = textToCompareRight
                votesObjMapList.push({})
            }

            mediaObjectList.push({
                ...leftMediaObject,
            })

            mediaObjectList.push({
                ...rightMediaObject,
            })

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
        await setDoc(
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

        setPreviewImage('')
    }

    const addImageToCompareLeft = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        const reader = new FileReader()
        const { target } = e
        if (!target) {
            return
        }
        // Extract file if it exists and read it
        const file = (target?.files && target?.files[0]) ?? null
        if (file) {
            reader.readAsDataURL(file)
        }

        // Reader is async, so use onload to attach a function
        // to set the loaded image from the reader
        reader.onload = (readerEvent) => {
            setImageToCompareLeft(readerEvent?.target?.result)
            setTextToCompareLeft('')
            if (targetEvent) {
                // Reset the event state so the user can reload
                // the same image twice
                targetEvent.target.value = ''
            }
        }
    }

    const addImageToCompareRight = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        const reader = new FileReader()
        const { target } = e
        if (!target) {
            return
        }
        // Extract file if it exists and read it
        const file = (target?.files && target?.files[0]) ?? null
        if (file) {
            reader.readAsDataURL(file)
        }

        // Reader is async, so use onload to attach a function
        // to set the loaded image from the reader
        reader.onload = (readerEvent) => {
            setImageToCompareRight(readerEvent?.target?.result)
            setTextToCompareRight('')
            if (targetEvent) {
                // Reset the event state so the user can reload
                // the same image twice
                targetEvent.target.value = ''
            }
        }
    }

    const addImageToPost = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        const reader = new FileReader()
        const { target } = e
        if (!target) {
            return
        }
        // Extract file if it exists and read it
        const file = (target?.files && target?.files[0]) ?? null
        if (file) {
            reader.readAsDataURL(file)
        }
        // Reader is async, so use onload to attach a function
        // to set the loaded image from the reader
        reader.onload = (readerEvent) => {
            setImageToPost(readerEvent?.target?.result)
            if (targetEvent) {
                // Reset the event state so the user can reload
                // the same image twice
                targetEvent.target.value = ''
            }
        }
    }

    const removeCompareObjects = () => {
        setImageToCompareLeft('')
        setImageToCompareRight('')
        setTextToCompareLeft('')
        setTextToCompareRight('')
        if (targetEvent) {
            targetEvent.target.value = ''
        }
    }

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        // Store the event to reset its state later
        // and allow the user to load the same image twice
        // if needed
        if (checkFileSize(e.target.files)) {
            setTargetEvent(e)
            addImageToPost(e)
        } else {
            setIsImageSizeLarge(true)
        }
    }

    const handleCompareLeftUpload = (e: ChangeEvent<HTMLInputElement>) => {
        // Store the event to reset its state later
        // and allow the user to load the same image twice
        // if needed
        if (checkFileSize(e.target.files)) {
            setTargetEvent(e)
            addImageToCompareLeft(e)
        } else {
            setIsImageSizeLarge(true)
        }
    }

    const handleCompareRightUpload = (e: ChangeEvent<HTMLInputElement>) => {
        // Store the event to reset its state later
        // and allow the user to load the same image twice
        // if needed
        if (checkFileSize(e.target.files)) {
            setTargetEvent(e)
            addImageToCompareRight(e)
        } else {
            setIsImageSizeLarge(true)
        }
    }

    const removeImage = (idx: number) => {
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

    const sendAndClose = async (
        e: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>
    ) => {
        e.preventDefault()

        // Validate form
        const isValid = validateForm()

        if (isValid) {
            if (isComparePost()) {
                const leftUrl = isValidURL(textToCompareLeft || '')
                if (leftUrl && leftUrl.length > 1 && !imageToCompareLeft) {
                    await checkPreviewImage(leftUrl).then(async (res) => {
                        await leftComparePreviewImagecallBack(res)
                    })
                }

                const rightUrl = isValidURL(textToCompareRight || '')
                if (rightUrl && rightUrl.length > 1 && !imageToCompareRight) {
                    await checkPreviewImage(rightUrl).then(async (res) => {
                        await rightComparePreviewImagecallBack(res)
                    })
                }
            }
            const url = isValidURL(descriptionRef?.current?.value || '')
            if (url && url.length > 1 && !imageToPost) {
                await checkPreviewImage(url).then(async (res) => {
                    await previewImagecallBack(res)
                })
            } else {
                setPreviewImage(' ')
            }
            // Close
            closeModal()
            // Trigger a post re-fetch with a timeout to give the database
            // time to register the new post
            setTimeout(() => queryClient.invalidateQueries('posts'), 2000)
        }
    }

    const handleCompareClick = () => {
        setExpanded(!expanded)
    }

    const handleKeyPress = (e: KeyboardEvent<HTMLButtonElement>) => {
        // Trigger on enter key
        if (e.keyCode === 13) {
            sendAndClose(e)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // clear errors if there are any. so they can reappear.
        if (errors?.question?.type) {
            clearErrors()
        }

        //check if input is URL, if it is a url remove it and show warning.
        const isURL = isValidURL(e.target.value)
        if (Boolean(isURL)) {
            setIsTitleURL(true)
        } else {
            isTitleURL && setIsTitleURL(false)
        }
    }

    return (
        <div className={postFormClass.modalDiv}>
            <Dialog.Title as="div" className={postFormClass.dialogTitle}>
                <div>What's your question?</div>
                <ToggleIncognito
                    onChange={() => setIsIncognito(!isIncognito)}
                />
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
                        maxLength={shortLimit}
                        onKeyPress={preventDefaultOnEnter}
                        onChange={handleInputChange}
                    />
                </div>
                {/* Warning message on Title */}
                {isTitleURL && (
                    <FlashErrorMessage
                        message={'Question should not be a URL'}
                        ms={100000}
                        style={postFormClass.formAlert}
                    />
                )}

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
                        maxLength={longLimit}
                    />
                </div>
            </form>

            {/* Upload Image OR compare*/}
            <div className={postFormClass.uploadBar}>
                <div className={'flex'}>
                    {/* Upload Image */}
                    <Tooltip toolTipText={'Upload Image'}>
                        <button
                            onClick={() => filePickerRef?.current?.click()}
                            className={postFormClass.imageButton}
                        >
                            <UilImagePlus />
                            <input
                                ref={filePickerRef}
                                onChange={handleImageUpload}
                                type="file"
                                accept="image/*"
                                onKeyPress={preventDefaultOnEnter}
                                hidden
                            />
                        </button>
                    </Tooltip>
                    {/* Trigger compare */}
                    <Tooltip toolTipText={'Compare'}>
                        <button
                            onClick={handleCompareClick}
                            className={postFormClass.imageButton}
                            aria-expanded={expanded}
                            aria-label="compare"
                        >
                            <UilBalanceScale />
                        </button>
                    </Tooltip>
                </div>
                {isImageSizeLarge && (
                    <FlashErrorMessage
                        message={`Image should be less then 10 MB`}
                        ms={warningTime}
                        style={postFormClass.imageSizeAlert}
                        onClose={() => setIsImageSizeLarge(false)}
                    />
                )}
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
                                            src={img as string} // Pass image to src
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
                        {/* Option A */}
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
                                            maxLength={shortLimit}
                                        />
                                    </div>

                                    {/* Image input A */}
                                    {!textToCompareLeft && (
                                        <>
                                            <p className={postFormClass.orText}>
                                                or
                                            </p>
                                            <button
                                                className={
                                                    postFormClass.compareUpload
                                                }
                                                onClick={() =>
                                                    filePickerCompareLeftRef?.current?.click()
                                                }
                                            >
                                                Upload Image
                                                <input
                                                    ref={
                                                        filePickerCompareLeftRef
                                                    }
                                                    onChange={
                                                        handleCompareLeftUpload
                                                    }
                                                    type="file"
                                                    accept="image/*"
                                                    onKeyPress={
                                                        preventDefaultOnEnter
                                                    }
                                                    hidden
                                                />
                                            </button>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                        {isImageSizeLarge && (
                            <FlashErrorMessage
                                message={`Image should be less then 10 MB`}
                                ms={warningTime}
                                style={postFormClass.imageSizeAlert}
                                onClose={() => setIsImageSizeLarge(false)}
                            />
                        )}
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
                                            maxLength={shortLimit}
                                        />
                                    </div>

                                    {/* Image input B */}
                                    {!textToCompareRight && (
                                        <>
                                            <p className={postFormClass.orText}>
                                                or
                                            </p>
                                            <button
                                                className={
                                                    postFormClass.compareUpload
                                                }
                                                onClick={() =>
                                                    filePickerCompareRightRef?.current?.click()
                                                }
                                            >
                                                Upload Image
                                                <input
                                                    ref={
                                                        filePickerCompareRightRef
                                                    }
                                                    onChange={
                                                        handleCompareRightUpload
                                                    }
                                                    type="file"
                                                    accept="image/*"
                                                    onKeyPress={
                                                        preventDefaultOnEnter
                                                    }
                                                    hidden
                                                />
                                            </button>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                        {isImageSizeLarge && (
                            <FlashErrorMessage
                                message={`Image should be less then 10 MB`}
                                ms={warningTime}
                                style={postFormClass.imageSizeAlert}
                                onClose={() => setIsImageSizeLarge(false)}
                            />
                        )}
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
                    disabled={isTitleURL}
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
