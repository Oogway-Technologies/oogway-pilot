import { UilCommentPlus } from '@iconscout/react-unicons'
import firebase from 'firebase/compat/app'
import {
    addDoc,
    collection,
    doc,
    serverTimestamp,
    setDoc,
} from 'firebase/firestore'
import { useRouter } from 'next/router'
import React, { MouseEvent, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRecoilValue } from 'recoil'

import { userProfileState } from '../../../atoms/user'
import { db } from '../../../firebase'
import needsHook from '../../../hooks/needsHook'
import { replyFormClass } from '../../../styles/feed'
import { longLimit, warningTime } from '../../../utils/constants/global'
import { FirebaseReply } from '../../../utils/types/firebase'
import Button from '../../Utils/Button'
import { Avatar } from '../../Utils/common/Avatar'
import FlashErrorMessage from '../../Utils/FlashErrorMessage'

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
    const userProfile = useRecoilValue(userProfileState)
    const router = useRouter()

    // Get a reference to the input text
    const inputRef = useRef<HTMLTextAreaElement>(null)

    // Track upload
    const [loading, setLoading] = useState(false)

    // Form management
    const {
        register,
        unregister,
        setError,
        formState: { errors },
    } = useForm()

    useEffect(() => {
        // Register the form inputs w/o hooks so as not to interfere w/ existing hooks
        register('reply', { required: true })
        // clean up on unmount
        return () => unregister('reply')
    }, [unregister])

    const addReply = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        // Return asap if no input
        if (inputRef && !inputRef?.current?.value) {
            setError(
                'reply',
                { type: 'required', message: 'A reply is required.' },
                { shouldFocus: true }
            )
            return false
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

        // Now add a new reply for this post
        const replyData: FirebaseReply = {
            postId: router.query.id as string,
            parentId: commentId,
            isComment: false,
            timestamp: serverTimestamp(),
            message: inputRef?.current?.value || '',
            author: userProfile.username,
            authorUid: userProfile.uid,
            likes: {}, // This is a map <user.uid, bool> for liked/disliked for each user
        }
        await addDoc(collection(db, `post-activity`), replyData)

        // Clear the input
        setLoading(false)
        if (inputRef.current) {
            inputRef.current.style.height = '20px'
            inputRef.current.value = ''
        }

        return true // Return true on a successful submission
    }

    const addAndClose = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const success = addReply(e)
        if (await success) {
            closeModal(e)
        }
    }

    return (
        <div className={replyFormClass.form}>
            <div className={replyFormClass.body}>
                {!isMobile && (
                    <Avatar
                        onClick={needsHook}
                        src={
                            userProfile?.profilePic
                                ? userProfile.profilePic
                                : ''
                        }
                    />
                )}
                <div className={replyFormClass.replyBar}>
                    <form className={'flex items-center'}>
                        {isMobile ? (
                            <textarea
                                ref={inputRef}
                                className={replyFormClass.replyTextArea}
                                placeholder={placeholder}
                                maxLength={longLimit}
                            />
                        ) : (
                            <textarea
                                ref={inputRef}
                                className={replyFormClass.growingTextArea}
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
                <div className="inline-flex mt-sm ml-auto">
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
