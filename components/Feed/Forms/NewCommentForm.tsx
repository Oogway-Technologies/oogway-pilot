import React, {
    ChangeEvent,
    MouseEvent,
    useEffect,
    useRef,
    useState,
} from 'react'
import { useForm } from 'react-hook-form'

// Database
import { db, storage } from '../../../firebase'
import firebase from 'firebase/compat/app'
import {
    addDoc,
    collection,
    doc,
    serverTimestamp,
    setDoc,
    updateDoc,
} from 'firebase/firestore'
import { getDownloadURL, ref, uploadString } from '@firebase/storage'
import { getUserDoc } from '../../../lib/userHelper'

// JSX and Styles
import { commentFormClass } from '../../../styles/feed'
import Button from '../../Utils/Button'

// Form
import { useRouter } from 'next/router'
// @ts-ignore
import {
    UilCommentPlus,
    UilImagePlus,
    UilTimesCircle,
} from '@iconscout/react-unicons'

// Recoil states
import { userProfileState } from '../../../atoms/user'
import { useRecoilValue } from 'recoil'

// Other and utilities
import preventDefaultOnEnter from '../../../utils/helpers/preventDefaultOnEnter'
import FlashErrorMessage from '../../Utils/FlashErrorMessage'
import { checkFileSize } from '../../../utils/helpers/common'
import { longLimit, warningTime } from '../../../utils/constants/global'
import { FirebaseComment } from '../../../utils/types/firebase'

type NewCommentFormProps = {
    closeModal: () => void
    isMobile: boolean
    placeholder: string
}

const NewCommentForm: React.FC<NewCommentFormProps> = ({
    closeModal,
    isMobile,
    placeholder,
}) => {
    const userProfile = useRecoilValue(userProfileState)
    const router = useRouter()

    // The image to post and to display as preview
    const [imageToPost, setImageToPost] = useState<
        string | ArrayBuffer | null | undefined
    >(null)
    const [targetEvent, setTargetEvent] =
        useState<ChangeEvent<HTMLInputElement>>() // Trick used to reset the state and allow the user to load the same image twice
    const filePickerRef = useRef<HTMLInputElement>(null) // Get a reference for the input image
    const inputRef = useRef<HTMLTextAreaElement>(null) // Get a reference to the input text

    // Track upload
    const [loading, setLoading] = useState(false)

    const [isImageSizeLarge, setIsImageSizeLarge] = useState(false)

    // Form management
    const {
        register,
        unregister,
        setError,
        formState: { errors },
    } = useForm()
    useEffect(() => {
        // Register the form inputs w/o hooks so as not to interfere w/ existing hooks
        register('comment', { required: true })
        // clean up on unmount
        return () => unregister('comment')
    }, [unregister])

    const addComment = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        // Return asap if no input
        if (inputRef && !inputRef?.current?.value) {
            setError(
                'comment',
                { type: 'required', message: 'A comment is required.' },
                { shouldFocus: true }
            )
            return false // Whether to addComment or not
        }

        // Avoid spamming the post button while uploading the post to the DB
        if (loading) return
        setLoading(true)

        // First of all, update last seen entry for the user
        // currently posting a comment
        const userDocRef = doc(db, 'users', userProfile.uid)
        await setDoc(
            userDocRef,
            {
                lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
            },
            { merge: true }
        )
        let commentData: FirebaseComment = {
            postId: router.query.id as string,
            parentId: null,
            isComment: true,
            timestamp: serverTimestamp(),
            message: inputRef?.current?.value,
            author: userProfile.username,
            authorUid: userProfile.uid,
            likes: {}, // This is a map <user.uid, bool> for liked/disliked for each user
        }
        const docRef = await addDoc(
            collection(db, `post-activity`),
            commentData
        )

        // After posting, check if the user has selected and image to post
        if (imageToPost) {
            // There is one image to upload: get its refernce in the DB
            const imageRef = ref(storage, `comments/${docRef.id}/image`)

            // Upload the image
            await uploadString(
                imageRef,
                imageToPost as string,
                'data_url'
            ).then(async () => {
                // Get the downloaded URL for the image
                const downloadURL = await getDownloadURL(imageRef)

                // Update the comment with the image URL
                await updateDoc(
                    doc(db, `posts/${router.query.id}/comments/${docRef.id}`),
                    {
                        postImage: downloadURL,
                    }
                )

                // Remove image preview
                setImageToPost(null)
            })
        }

        // Everything is done
        setLoading(false)
        if (inputRef.current) {
            inputRef.current.style.height = '24px'
            inputRef.current.value = ''
        }

        return true // Return true on a successful submission
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

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
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

    const addAndClose = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const success = addComment(e)
        if (await success) {
            closeModal()
        }
    }

    return (
        <div className={commentFormClass.form}>
            <div className={commentFormClass.body}>
                <div className={commentFormClass.commentBar}>
                    <form className={'flex items-center w-full'}>
                        {isMobile ? (
                            <textarea
                                ref={inputRef}
                                className={commentFormClass.commentTextArea}
                                placeholder={placeholder}
                                maxLength={longLimit}
                            />
                        ) : (
                            <textarea
                                ref={inputRef}
                                className={commentFormClass.growingTextArea}
                                placeholder={placeholder}
                                rows={1}
                                maxLength={longLimit}
                                onChange={(
                                    e: React.ChangeEvent<HTMLTextAreaElement>
                                ) => {
                                    e.target.style.height = '0px'
                                    e.target.style.height =
                                        e.target.scrollHeight + 'px'
                                }}
                            />
                        )}
                    </form>
                    {/* Image upload */}
                    {!isMobile && (
                        <button
                            onClick={() => filePickerRef?.current?.click()}
                            className={commentFormClass.imageButton}
                        >
                            <UilImagePlus />
                            <input
                                ref={filePickerRef}
                                onChange={handleImageUpload}
                                type="file"
                                accept="image/*"
                                hidden
                            />
                        </button>
                    )}
                </div>
                {!isMobile && (
                    <Button
                        text="Add"
                        keepText={false}
                        icon={<UilCommentPlus />}
                        type="submit"
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
                        style={commentFormClass.formAlert}
                    />
                )}
            </div>
            {isMobile && (
                <div className={commentFormClass.mobileSubmitDiv}>
                    <button
                        onClick={() => filePickerRef?.current?.click()}
                        className={commentFormClass.imageButton}
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
                    <Button
                        text="Add"
                        keepText={false}
                        icon={<UilCommentPlus />}
                        type="submit"
                        onClick={addAndClose}
                        addStyle={commentFormClass.submitButton}
                    />
                </div>
            )}
            {isImageSizeLarge && (
                <FlashErrorMessage
                    message={`Image should be less then 10 MB`}
                    ms={warningTime}
                    style={commentFormClass.imageSizeAlert}
                    onClose={() => setIsImageSizeLarge(false)}
                />
            )}

            {/* Show preview of the image and click it to remove the image from the post */}
            {imageToPost && (
                <div className={commentFormClass.previewDiv}>
                    <div className={commentFormClass.imagePreview}>
                        <img
                            className={commentFormClass.image}
                            src={imageToPost as string}
                            alt=""
                        />
                        <UilTimesCircle
                            className={commentFormClass.removeImageButton}
                            onClick={() => setImageToPost(null)}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default NewCommentForm
