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
import { useComments } from '../../../hooks/useComments'

type CommentsAPIProps = {
    comments: firebase.firestore.QueryDocumentSnapshot
}

const CommentsAPI: React.FC<CommentsAPIProps> = ({ comments }) => {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)

    // Track mobile state
    const isMobile = useMediaQuery('(max-width: 500px)')

    // Retrieve user profile
    const userProfile = useRecoilValue(userProfileState)

    // Get a snapshot of the comments from the DB
    const [commentsSnapshot] = useComments(router.query.id)

    // Modal helper functions
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
            return commentsSnapshot.map((comment) => (
                <Comment
                    key={comment.id}
                    commentOwner={comment.data().authorUid}
                    postId={router.query.id}
                    commentId={comment.id}
                    comment={{
                        ...comment.data(),
                        timestamp: comment.data().timestamp?.toDate().getTime(),
                    }}
                />
            ))
        } else {
            // Visualize the server-side rendered comments
            return JSON.parse(comments).map((comment) => (
                <Comment
                    key={comment.id}
                    commentOwner={comment.authorUid}
                    postId={router.query.id}
                    commentId={comment.id}
                    comment={comment}
                />
            ))
        }
    }

    return (
        <>
            <div className={commentsApiClass.outerDiv}>
                <hr className={commentsApiClass.hr} />
                {/* New Comment Form */}
                <div className={commentsApiClass.innerDiv}>
                    <Avatar
                        onClick={needsHook}
                        className={commentsApiClass.avatar}
                        src={
                            userProfile?.profilePic
                                ? userProfile.profilePic
                                : null
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
                </div>

                {/* Comment counter */}
                <p className={commentsApiClass.counter}>
                    {commentsSnapshot
                        ? commentsSnapshot.length
                        : JSON.parse(comments).length}{' '}
                    Answers
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
