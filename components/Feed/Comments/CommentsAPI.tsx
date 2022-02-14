import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Comment from './Comment'
import { commentFormClass, commentsApiClass } from '../../../styles/feed'
import needsHook from '../../../hooks/needsHook'
import { Avatar, useMediaQuery } from '@mui/material'
import firebase from 'firebase/compat/app'
import NewCommentForm from '../Forms/NewCommentForm'
import Button from '../../Utils/Button'
import Modal from '../../Utils/Modal'
import { userProfileState } from '../../../atoms/user'
import { useRecoilValue } from 'recoil'
import { useUser } from '@auth0/nextjs-auth0'
import { collection, orderBy, query } from 'firebase/firestore'
import { useCollection } from 'react-firebase-hooks/firestore'
import { db } from '../../../firebase'
import { usePostNumberComments } from '../../../hooks/useNumberComments'
import {
    commmentConverter,
    FirebaseComment,
} from '../../../utils/types/firebase'

type CommentsAPIProps = {
    comments: firebase.firestore.QueryDocumentSnapshot
}
// TO BE DELETED
const CommentsAPI: React.FC<CommentsAPIProps> = ({ comments }) => {
    // Retrieve user profile
    const userProfile = useRecoilValue(userProfileState)
    const { user } = useUser()

    // Get a snapshot of the comments from the DB
    const router = useRouter()
    const [commentsSnapshot] = useCollection(
        query(
            collection(db, `posts/${router.query.id}/comments`).withConverter(
                commmentConverter
            ),
            orderBy('timestamp', 'asc')
        )
    )
    const [numComments] = usePostNumberComments(router.query.id as string)

    // Track mobile state
    const isMobile = useMediaQuery('(max-width: 500px)')

    // Modal
    const [isOpen, setIsOpen] = useState(false)
    const openModal = () => {
        setIsOpen(true)
    }

    const closeModal = () => {
        setIsOpen(false)
    }

    const showComments = () => {
        // Check if the snapshot is ready,
        // if so show the comments.
        // If not, show the props comments
        if (commentsSnapshot) {
            return commentsSnapshot?.docs.map((comment) => {
                return (
                    <Comment
                        key={comment.id}
                        commentOwner={comment.data().authorUid}
                        postId={router.query.id as string}
                        commentId={comment.id}
                        comment={{
                            ...comment.data(),
                            timestamp: comment.data().timestamp,
                        }}
                    />
                )
            })
        } else {
            // Visualize the server-side rendered comments
            return JSON.parse(comments.toString()).map(
                (comment: FirebaseComment) => (
                    <Comment
                        key={comment.id}
                        commentOwner={comment.authorUid}
                        postId={router.query.id as string}
                        commentId={comment.id!}
                        comment={comment}
                    />
                )
            )
        }
    }

    const showCommentForm = () => {
        return (
            <>
                <Avatar
                    onClick={needsHook}
                    className={commentsApiClass.avatar}
                    src={
                        userProfile?.profilePic
                            ? userProfile.profilePic
                            : undefined
                    }
                />
                {isMobile ? (
                    <Button
                        text="Add Comment"
                        keepText={true}
                        icon={null}
                        type="button"
                        onClick={openModal}
                        addStyle={commentFormClass.submitButton}
                    />
                ) : (
                    <NewCommentForm
                        placeholder={
                            userProfile?.name
                                ? `What do you think, ${userProfile.name}?`
                                : 'What do you think?'
                        }
                        isMobile={isMobile}
                        closeModal={closeModal}
                    />
                )}
            </>
        )
    }

    return (
        <>
            <div className={commentsApiClass.outerDiv}>
                <hr className={commentsApiClass.hr} />
                {/* New Comment Form */}
                <div className={commentsApiClass.innerDiv}>
                    {user ? (
                        showCommentForm()
                    ) : (
                        <div className={commentsApiClass.loginReminder}>
                            Please log in to comment on posts.
                        </div>
                    )}
                </div>

                {/* Comment counter */}
                <p className={commentsApiClass.counter}>
                    {numComments === 0
                        ? `No Answers. Be the first.`
                        : numComments === 1
                        ? `${numComments} Answer`
                        : `${numComments} Answers`}
                </p>

                {/* Post's Comments */}
                {showComments()}
            </div>

            <Modal
                children={
                    <NewCommentForm
                        placeholder={
                            userProfile?.name
                                ? `What do you think, ${userProfile.name}?`
                                : 'What do you think?'
                        }
                        closeModal={closeModal}
                        isMobile={isMobile}
                    />
                }
                show={isOpen}
                onClose={closeModal}
            />
        </>
    )
}

export default CommentsAPI
