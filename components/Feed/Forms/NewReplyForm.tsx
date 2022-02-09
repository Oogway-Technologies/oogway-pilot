import React, { useEffect, useRef, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useForm } from 'react-hook-form'
import { auth, db, storage } from '../../../firebase'
import {
    UilCommentPlus,
    UilExclamationTriangle,
    UilImagePlus,
    UilTimesCircle,
} from '@iconscout/react-unicons'
import useTimeout from '../../../hooks/useTimeout'
import { useRouter } from 'next/router'
import firebase from 'firebase/compat/app'
import { avatarURL, replyFormClass } from '../../../styles/feed'
import Button from '../../Utils/Button'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import needsHook from '../../../hooks/needsHook'
import { doc } from 'firebase/firestore'
import { Avatar } from '@mui/material'
import preventDefaultOnEnter from '../../../utils/helpers/preventDefaultOnEnter'

type NewReplyFormProps = {
    commentId: string
    closeModal: React.MouseEventHandler<HTMLButtonElement>
    isMobile: boolean
    placeholder: string
}

const NewReplyForm: React.FC<NewReplyFormProps> = ({
    commentId,
    closeModal,
    isMobile,
    placeholder,
}) => {
    const router = useRouter()
    const [user] = useAuthState(auth)
    const [userProfile] = useDocumentData(doc(db, 'profiles', user.uid)) // This needs to be stored in global state eventually

    // Get a reference to the input text
    const inputRef = useRef(null)

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
        register('reply', { required: true })
        // clean up on unmount
        return () => unregister('reply')
    }, [unregister])

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

    const addReply = (e) => {
        e.preventDefault()

        // Return asap if no input
        if (!inputRef.current.value) {
            setError(
                'reply',
                { type: 'required', message: 'A reply is required.' },
                { shouldFocus: true }
            )
            return false
        }

        // First of all, update last seen entry for the user
        // currently posting a comment
        db.collection('users').doc(user.uid).set(
            {
                lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
            },
            { merge: true }
        ) // Remember to MERGE the content otherwise it will be overwritten!

        // Now add a new reply for this post
        let replyData = {
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: inputRef.current.value,
            author: user.username ? user.username : user.email,
            authorUid: user.uid,
            photoURL: user.photoURL ? user.photoURL : avatarURL,
            likes: {}, // This is a map <user.uid, bool> for liked/disliked for each user
        }
        db.collection('posts')
            .doc(router.query.id)
            .collection('comments')
            .doc(commentId)
            .collection('replies')
            .add(replyData)
            .then((doc) => {
                // Store the reference to this reply in the map of repliess
                // create by the current user.
                db.collection('users')
                    .doc(user.uid)
                    .get()
                    .then((userDoc) => {
                        let tmp = userDoc.data()

                        // Since replies don't exist as their own colletion but rather as
                        // a sub-collection under comments, we must use a map to
                        // store comments where the key is the comment id and the value
                        // it points to is the parent post id it resides under.
                        if ('replies' in tmp) {
                            tmp.replies[doc.id] = {
                                comment: commentId,
                                post: router.query.id,
                            }
                        } else {
                            // Add a new entry
                            let newReplies: Map<string, object> = new Map<
                                string,
                                object
                            >()
                            newReplies.set(doc.id, {
                                comment: commentId,
                                post: router.query.id,
                            })
                            tmp['replies'] = newReplies
                        }

                        userDoc.ref.update(tmp)
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            })

        // Clear the input
        inputRef.current.value = ''

        return true
    }

    const addAndClose = (e) => {
        e.preventDefault()
        const success = addReply(e)
        if (success) {
            closeModal(e)
        }
    }

    return (
        <div className={replyFormClass.form}>
            <div className={replyFormClass.body}>
                {!isMobile && (
                    <Avatar
                        onClick={needsHook}
                        className={replyFormClass.avatar}
                        src={
                            userProfile?.profilePic
                                ? userProfile.profilePic
                                : null
                        }
                    />
                )}
                <div className={replyFormClass.replyBar}>
                    <form>
                        {isMobile ? (
                            <textarea
                                ref={inputRef}
                                className={replyFormClass.replyTextArea}
                                placeholder={placeholder}
                                onKeyPress={preventDefaultOnEnter}
                            />
                        ) : (
                            <input
                                ref={inputRef}
                                className={replyFormClass.replyInput}
                                type="text"
                                placeholder={placeholder}
                                onKeyPress={preventDefaultOnEnter}
                            />
                        )}
                    </form>
                </div>
                {!isMobile && (
                    <Button
                        text="Add"
                        keepText={false}
                        icon={<UilCommentPlus />}
                        type="submit"
                        onClick={addReply}
                        addStyle={replyFormClass.submitButton}
                    />
                )}
            </div>
            {/* Warning message on missing question */}
            <div>
                {errors.reply && errors.reply.type === 'required' && (
                    <FlashErrorMessage
                        message={errors.reply.message}
                        ms={warningTime}
                        style={
                            isMobile
                                ? replyFormClass.formAlertMobile
                                : replyFormClass.formAlert
                        }
                    />
                )}
            </div>
            {isMobile && (
                <div className="inline-flex mt-sm">
                    <Button
                        text="Add"
                        keepText={false}
                        icon={<UilCommentPlus />}
                        type="submit"
                        onClick={addAndClose}
                        addStyle={replyFormClass.submitButton}
                    />
                </div>
            )}
        </div>
    )
}

export default NewReplyForm
