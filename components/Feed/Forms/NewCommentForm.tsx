import React, { useEffect, useRef, useState } from 'react'
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
import { ref, getDownloadURL, uploadString } from '@firebase/storage'
import { getUserDoc } from '../../../lib/userHelper'

// JSX and Styles
import { commentFormClass } from '../../../styles/feed'
import Button from '../../Utils/Button'

// Form
import { useRouter } from 'next/router'
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

type NewCommentFormProps = {
    closeModal: React.MouseEventHandler<HTMLButtonElement>
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
    const [imageToPost, setImageToPost] = useState(null)
    const [targetEvent, setTargetEvent] = useState(null) // This is a trick I need to use to reset the state and allow the user
    // to load the same image twice
    const filePickerRef = useRef(null) // Get a reference for the input image
    const inputRef = useRef(null) // Get a reference to the input text

    // Track upload
    const [loading, setLoading] = useState(false)

    // Form management
    const {
        register,
        unregister,
        setError,
        formState: { errors },
    } = useForm()
    const warningTime = 3000 // set warning to flash for 3 sec
    useEffect(() => {
        // Register the form inputs w/o hooks so as not to interfere w/ existing hooks
        register('comment', { required: true })
        // clean up on unmount
        return () => unregister('comment')
    }, [unregister])

    const addComment = async (e) => {
        e.preventDefault()

        // Return asap if no input
        if (inputRef && !inputRef.current.value) {
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
        setDoc(
            userDocRef,
            {
                lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
            },
            { merge: true }
        )

        // Now add a new comment for this post
        let commentData = {
            timestamp: serverTimestamp(),
            message: inputRef.current.value,
            author: userProfile.username,
            authorUid: userProfile.uid,
            likes: {}, // This is a map <user.uid, bool> for liked/disliked for each user
        }
        const docRef = await addDoc(
            collection(db, `posts/${router.query.id}/comments`),
            commentData
        )

        // After posting, check if the user has selected and image to post
        if (imageToPost) {
            // There is one image to upload: get its refernce in the DB
            const imageRef = ref(storage, `comments/${docRef.id}/image`)

            // Upload the image
            await uploadString(imageRef, imageToPost, 'data_url').then(
                async () => {
                    // Get the downloaded URL for the image
                    const downloadURL = await getDownloadURL(imageRef)

                    // Update the comment with the image URL
                    await updateDoc(
                        doc(
                            db,
                            'posts',
                            router.query.id,
                            'comments',
                            docRef.id
                        ),
                        {
                            postImage: downloadURL,
                        }
                    )

                    // Remove image preview
                    setImageToPost(null)
                }
            )
        }

        // Store the reference to this comment in the map of comments
        // create by the current user.
        const userDoc = getUserDoc(userProfile.uid)
        await userDoc
            .then(async (doc) => {
                if (doc?.exists()) {
                    let tmp = doc.data()

                    // Since comments don't exist as their own colletion but rather as
                    // a sub-collection under individual posts, we must use a map to
                    // store comments where the key is the comment id and the value
                    // it points to is the parent post id it resides under.
                    if ('comments' in tmp) {
                        tmp.comments[docRef.id] = router.query.id
                    } else {
                        // Add a new entry
                        let newComments = {}
                        newComments[docRef.id] = router.query.id
                        tmp['comments'] = newComments
                    }
                    await updateDoc(doc?.ref, tmp)
                }
            })
            .catch((err) => {
                console.log(err)
            })

        // Everything is done
        setLoading(false)
        if (inputRef.current) {
            inputRef.current.value = ''
        }

        return true // Return true on a successful submission
    }

    const addImageToPost = (e) => {
        e.preventDefault()
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

    const handleImageUpload = (e) => {
        e.preventDefault()
        // Store the event to reset its state later
        // and allow the user to load the same image twice
        // if needed
        setTargetEvent(e)
        addImageToPost(e)
    }

    const addAndClose = async (e) => {
        e.preventDefault()
        const success = addComment(e)
        if (await success) {
            closeModal(e)
        }
    }

    return (
        <div className={commentFormClass.form}>
            <div className={commentFormClass.body}>
                <div className={commentFormClass.commentBar}>
                    <form>
                        {isMobile ? (
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
                                type="file"
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
                        onClick={() => filePickerRef.current.click()}
                        className={commentFormClass.imageButton}
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

            {/* Show preview of the image and click it to remove the image from the post */}
            {imageToPost && (
                <div className={commentFormClass.previewDiv}>
                    <div className={commentFormClass.imagePreview}>
                        <img
                            className={commentFormClass.image}
                            src={imageToPost}
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
