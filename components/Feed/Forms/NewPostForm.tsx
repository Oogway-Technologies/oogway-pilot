import { getDownloadURL, ref, uploadString } from '@firebase/storage'
import {
    UilBalanceScale,
    UilImagePlus,
    UilNavigator,
    UilTimesCircle,
} from '@iconscout/react-unicons'
import { Collapse } from '@mui/material'
import {
    addDoc,
    collection,
    doc,
    serverTimestamp,
    setDoc,
    updateDoc,
} from 'firebase/firestore'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'
import React, {
    ChangeEvent,
    FC,
    KeyboardEvent,
    MouseEvent,
    useEffect,
    useRef,
    useState,
} from 'react'
// Form management
import { useForm } from 'react-hook-form'
// Queries
import { useQueryClient } from 'react-query'
import Select from 'react-select'
import { useRecoilState, useRecoilValue } from 'recoil'

import {
    compareFormExpanded,
    comparePostType,
    hasPreviewedCompare,
    imageCompareLeft,
    imageCompareRight,
    labelCompareLeft,
    labelCompareRight,
    leftPreviewImage,
    rightPreviewImage,
    textCompareLeft,
    textCompareRight,
} from '../../../atoms/compareForm'
import { feedState } from '../../../atoms/feeds'
import { fileSizeTooLarge } from '../../../atoms/forms'
// Recoil states
import { userProfileState } from '../../../atoms/user'
// Database
import { db, storage } from '../../../firebase'
import { useFeedOptions } from '../../../hooks/useFeedOptions'
import { postFormClass } from '../../../styles/feed'
import {
    longLimit,
    shortLimit,
    warningTime,
} from '../../../utils/constants/global'
import {
    amazonURLAppendQueryString,
    checkFileSize,
    fetcher,
    isValidURL,
} from '../../../utils/helpers/common'
// Other and utilities
import preventDefaultOnEnter from '../../../utils/helpers/preventDefaultOnEnter'
import { FirebasePost } from '../../../utils/types/firebase'
import { compareFilePickerRefs, MediaObject } from '../../../utils/types/global'
import { staticFeedOptions } from '../../../utils/types/params'
// JSX components
import Button from '../../Utils/Button'
import FlashErrorMessage from '../../Utils/FlashErrorMessage'
import { Tooltip } from '../../Utils/Tooltip'
import ToggleIncognito from '../Post/ToggleIncognito'
import _CompareChooseTypeForm from './Compare/_CompareChooseTypeForm'

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

    // Feed Category drop down
    const router = useRouter()
    const [feedOptions] = useFeedOptions()
    const [currentFeed, setCurrentFeed] = useRecoilState(feedState)
    const { theme } = useTheme()

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
    }, [register])
    useEffect(() => {
        register('compare', { required: true })
    }, [register])
    useEffect(() => {
        register('feed', { required: true })
    }, [register])

    const [loading, setLoading] = useState(false)

    // Get a reference to the input text
    const inputRef = useRef<HTMLInputElement>(null)

    // Get a reference to the description text
    const descriptionRef = useRef<HTMLTextAreaElement>(null)

    // Get a reference to the feed selection
    const [selectedFeed, setSelectedFeed] = useState<string>('')
    useEffect(() => {
        if (currentFeed !== 'All') {
            setSelectedFeed(currentFeed)
        }
    }, [setSelectedFeed, currentFeed])

    // Get a reference for the input image
    const filePickerRef = useRef<HTMLInputElement>(null)
    // The image to post and to display as preview
    const [imageToPost, setImageToPost] = useState<
        string | ArrayBuffer | null | undefined
    >(null)

    // Track whether user has opted to post anonymously
    const [isIncognito, setIsIncognito] = useState<boolean>(false)

    // This is a trick I need to use to reset the state and allow the user
    // to load the same image twice
    const [targetEvent, setTargetEvent] =
        useState<ChangeEvent<HTMLInputElement>>()

    // Refs and state for Compare post
    const [expanded, setExpanded] = useRecoilState(compareFormExpanded)
    const [compareType, setCompareType] = useRecoilState(comparePostType)
    useRecoilState(textCompareLeft)
    const [hasPreviewed, setHasPreviewed] = useRecoilState(hasPreviewedCompare)
    const [textToCompareRight, setTextToCompareRight] =
        useRecoilState(textCompareRight)
    const [textToCompareLeft, setTextToCompareLeft] =
        useRecoilState(textCompareLeft)
    const [imageToCompareLeft, setImageToCompareLeft] =
        useRecoilState(imageCompareLeft)
    const [imageToCompareRight, setImageToCompareRight] =
        useRecoilState(imageCompareRight)
    const [labelToCompareLeft, setLabelToCompareLeft] =
        useRecoilState(labelCompareLeft)
    const [labelToCompareRight, setLabelToCompareRight] =
        useRecoilState(labelCompareRight)
    const filePickerCompareLeftRef = useRef<HTMLInputElement>(null)
    const filePickerCompareRightRef = useRef<HTMLInputElement>(null)
    const compareFilePickers = useRef<compareFilePickerRefs>({
        left: filePickerCompareLeftRef,
        right: filePickerCompareRightRef,
    })
    const [isImageSizeLarge, setIsImageSizeLarge] =
        useRecoilState(fileSizeTooLarge)
    const [previewImage, setPreviewImage] = useState<string>('')
    const [leftComparePreviewImage, setLeftComparePreviewImage] =
        useRecoilState(leftPreviewImage)
    const [rightComparePreviewImage, setRightComparePreviewImage] =
        useRecoilState(rightPreviewImage)
    const [isTitleURL, setIsTitleURL] = useState<boolean>(false)

    // I'm pretty sure this is introducing a memory leak
    // useEffect cannot unclude async logic
    useEffect(() => {
        if (previewImage) {
            sendPost().finally()
        }
    }, [previewImage])

    // Reset form global state on umount
    useEffect(() => {
        return () => {
            setExpanded(false)
            setIsImageSizeLarge(false)
            setCompareType('textOnly')
            setImageToCompareLeft(null)
            setImageToCompareRight(null)
            setTextToCompareLeft('')
            setTextToCompareRight('')
            setLabelToCompareLeft('')
            setLabelToCompareRight('')
            setHasPreviewed(false)
            setSelectedFeed('')
        }
    }, [
        setExpanded,
        setCompareType,
        setIsImageSizeLarge,
        setImageToCompareLeft,
        setImageToCompareRight,
        setLabelToCompareLeft,
        setLabelToCompareRight,
        setTextToCompareLeft,
        setTextToCompareRight,
        setHasPreviewed,
        setSelectedFeed,
    ])

    // Update form selection
    const selectFeedHandler = (selectedOption: staticFeedOptions | null) => {
        setSelectedFeed(selectedOption ? selectedOption.label : '')
    }

    // Processing the images received from backend for description field
    const previewImagecallBack = async (res: string[]) => {
        if (res.length > 0) {
            setPreviewImage(res[0])
        } else {
            setPreviewImage(' ')
        }
    }

    // Processing the images received from backend for left compare Link field
    const leftComparePreviewImagecallBack = async (res: string[]) => {
        if (res.length > 0) {
            setLeftComparePreviewImage(res[0])
        } else {
            setLeftComparePreviewImage(' ')
        }
    }

    // Processing the images received from backend for right compare Link field
    const rightComparePreviewImagecallBack = async (res: string[]) => {
        if (res.length > 0) {
            setRightComparePreviewImage(res[0])
        } else {
            setRightComparePreviewImage(' ')
        }
    }

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
            (textToCompareLeft && textToCompareRight)
            // ||
            // (imageToCompareLeft && textToCompareRight) ||
            // (textToCompareLeft && imageToCompareRight)
        )
    }

    const isMissingDataForPreview = () => {
        return !isComparePost() && compareType != 'chooseType'
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

        // Ensure feed has been selected
        let feedProvided = true
        if (selectedFeed === '') {
            setError(
                'feed',
                { type: 'required', message: 'Please select a feed category.' },
                { shouldFocus: true }
            )
            feedProvided = false
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

        if (!questionProvided || !questionHasMedia || !feedProvided) {
            setTimeout(() => clearErrors(), 3000)
        }

        // Whether to sendPost or not
        return (
            questionProvided && feedProvided && questionHasMedia && !isTitleURL
        )
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
        const postData: FirebasePost = {
            message: inputRef?.current?.value || '', // Leaving field name as message even though UI refers to it as a question
            description: amazonURLAppendQueryString(
                descriptionRef?.current?.value || ''
            ), // Optional description
            feed: selectedFeed,
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
            const compareData = {
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
                setImageToPost(null)
                if (targetEvent) {
                    // Reset the event state so the user can reload
                    // the same image twice
                    targetEvent.target.value = ''
                }
            })
        }

        if (isComparePost()) {
            // This is a compare post and it is slightly more complex than the single image post
            // since now we need to upload two images and/or text to the DB and post
            // let mediaObjectList: { type: string; value: string }[] = []
            const leftMediaObject: MediaObject = {
                text: '',
                image: '',
                previewImage: '',
            }
            const rightMediaObject: MediaObject = {
                text: '',
                image: '',
                previewImage: '',
            }
            const mediaObjectList: MediaObject[] = []
            const votesObjMapList: object[] = [] // TODO: remove and fix likes

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

                // Optionally, append label
                if (labelToCompareLeft) {
                    leftMediaObject.label = labelToCompareLeft
                }
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

                // Optionally, append label
                if (labelToCompareRight) {
                    rightMediaObject.label = labelToCompareRight
                }
            } else {
                rightMediaObject.previewImage = rightComparePreviewImage
            }

            if (textToCompareLeft) {
                leftMediaObject.text =
                    amazonURLAppendQueryString(textToCompareLeft)
                votesObjMapList.push({})
            }

            if (textToCompareRight) {
                rightMediaObject.text =
                    amazonURLAppendQueryString(textToCompareRight)
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
        reader.onload = readerEvent => {
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
        reader.onload = readerEvent => {
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
        reader.onload = readerEvent => {
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
                    await checkPreviewImage(leftUrl).then(async res => {
                        await leftComparePreviewImagecallBack(res)
                    })
                }

                const rightUrl = isValidURL(textToCompareRight || '')
                if (rightUrl && rightUrl.length > 1 && !imageToCompareRight) {
                    await checkPreviewImage(rightUrl).then(async res => {
                        await rightComparePreviewImagecallBack(res)
                    })
                }
            }
            const url = isValidURL(descriptionRef?.current?.value || '')
            if (url && url.length > 1 && !imageToPost) {
                await checkPreviewImage(url).then(async res => {
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

            // Re-route to proper feed
            if (selectedFeed !== currentFeed) {
                setCurrentFeed(selectedFeed)
                router.push(`/?feed=${selectedFeed}`, undefined, {
                    shallow: true,
                })
            }
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

        // check if input is URL, if it is a url remove it and show warning.
        const isURL = isValidURL(e.target.value)
        if (isURL) {
            setIsTitleURL(true)
        } else {
            if (isTitleURL) {
                setIsTitleURL(false)
            }
        }
    }

    return (
        <div className={postFormClass.modalDiv}>
            <div className={postFormClass.dialogTitle}>
                <div>{`What's your question?`}</div>
                <ToggleIncognito
                    onChange={() => setIsIncognito(!isIncognito)}
                />
            </div>
            {/* Question form */}
            <form className={postFormClass.form}>
                {/* Question: required */}
                <div
                    className={`${postFormClass.formQuestion} ${
                        isTitleURL
                            ? ' border-error focus-within:border-error focus-visible:border-error active:border-error'
                            : ''
                    }`}
                >
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
                        message={'URLs are not allowed in question'}
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
                {/* Feed Selector */}
                {/* {currentFeed === 'All' ? (
                    <> */}
                <Select
                    options={feedOptions}
                    onChange={selectFeedHandler}
                    defaultValue={
                        currentFeed !== 'All'
                            ? { value: currentFeed, label: currentFeed }
                            : null
                    }
                    placeholder="Select Feed..."
                    isClearable={true}
                    maxMenuHeight={135}
                    menuPosition={'fixed'}
                    styles={{
                        placeholder: (provided, state) => ({
                            ...provided,
                            marginLeft: '16px',
                            fontWeight: 'normal',
                            fontSize: '14px',
                            fontStyle: 'normal',
                        }),
                        input: (provided, state) => ({
                            ...provided,
                            marginLeft: '16px',
                            fontWeight: 'normal',
                            fontSize: '14px',
                            fontStyle: 'normal',
                        }),
                        singleValue: (provided, state) => ({
                            ...provided,
                            marginLeft: '16px',
                            fontWeight: 'normal',
                            fontSize: '14px',
                            fontStyle: 'normal',
                        }),
                    }}
                    theme={prevTheme => ({
                        ...prevTheme,
                        borderRadius: 8,
                        colors: {
                            ...prevTheme.colors,
                            primary: '#7269FF',
                            primary25:
                                theme === 'light' ? '#D8D8D8' : '#3A3B3C',
                            primary50:
                                theme === 'light' ? '#BFBFBF' : '#2E2E2E',
                            primary75:
                                theme === 'light' ? '#BFBFBF' : '#2E2E2E',
                            neutral0: theme === 'light' ? 'white' : '#242526',
                            neutral80: theme === 'light' ? 'black' : 'white',
                            neutral90:
                                theme === 'light' ? '#D8D8D8' : '#242526',
                        },
                    })}
                />
                {errors.feed && errors.feed.type === 'required' && (
                    <FlashErrorMessage
                        message={errors.feed.message}
                        ms={warningTime}
                        style={postFormClass.formAlert}
                    />
                )}
                {/* </>
                ) : (
                    <div className={postFormClass.fixedFeed}>
                        Posting to{' '}
                        <span className={postFormClass.feedSpan}>
                            {currentFeed}
                        </span>{' '}
                        feed.
                    </div>
                )} */}
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
                    <Tooltip toolTipText={'Add Poll'}>
                        <button
                            onClick={handleCompareClick}
                            className={postFormClass.imageButton}
                            aria-expanded={expanded}
                            aria-label="poll"
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
            {imageToPost && (
                <div className={postFormClass.previewDiv}>
                    <div className={postFormClass.imagePreview}>
                        <img
                            className={postFormClass.image}
                            src={imageToPost as string} // Pass image to src
                            alt=""
                        />
                        <UilTimesCircle
                            className={postFormClass.removeImageButton}
                            onClick={() => setImageToPost(null)}
                        />
                    </div>
                </div>
            )}

            <Collapse
                className="px-2"
                in={expanded}
                timeout="auto"
                unmountOnExit
            >
                <_CompareChooseTypeForm
                    handleLeftUpload={handleCompareLeftUpload}
                    handleRightUpload={handleCompareRightUpload}
                    ref={compareFilePickers}
                />
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
                {expanded && !hasPreviewed && compareType != 'chooseType' ? (
                    <Button
                        text="Preview"
                        keepText={true}
                        icon={<UilNavigator />}
                        type="button"
                        disabled={isMissingDataForPreview() ? true : false}
                        addStyle={
                            postFormClass.PostButton +
                            (isMissingDataForPreview()
                                ? ' cursor-not-allowed opacity-50'
                                : '')
                        }
                        onClick={() => setHasPreviewed(true)}
                    />
                ) : (
                    <Button
                        text="Post"
                        keepText={true}
                        icon={<UilNavigator />}
                        type="submit"
                        addStyle={postFormClass.PostButton}
                        onClick={sendAndClose}
                        onKeyPress={handleKeyPress}
                    />
                )}
            </div>
        </div>
    )
}

NewPostForm.defaultProps = {
    questPlaceholder: 'Type your question...',
    descPlaceholder: 'Description (optional)',
}

export default NewPostForm
