import React, { useState } from 'react'
import { useCollection, useDocumentData } from 'react-firebase-hooks/firestore'
import { auth, db } from '../../../firebase'
import { useRouter } from 'next/router'
import Comment from './Comment'
import {
    avatarURL,
    commentFormClass,
    commentsApiClass,
} from '../../../styles/feed'
import { doc } from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import needsHook from '../../../hooks/needsHook'
import { Avatar, useMediaQuery } from '@mui/material'
import firebase from 'firebase/compat/app'
import NewCommentForm from '../Forms/NewCommentForm'
import Button from '../../Utils/Button'
import { UilCommentPlus } from '@iconscout/react-unicons'
import Modal from '../../Utils/Modal'

type CommentsAPIProps = {
    comments: firebase.firestore.QueryDocumentSnapshot
}

const CommentsAPI: React.FC<CommentsAPIProps> = ({ comments }) => {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)

    // Track mobile state
    const isMobile = useMediaQuery('(max-width: 500px)')

    // Retrieve user profile
    const [user] = useAuthState(auth)
    const [userProfile] = useDocumentData(doc(db, 'profiles', user.uid))

    // Get a snapshot of the comments from the DB
    const [commentsSnapshot] = useCollection(
        db
            .collection('posts')
            .doc(router.query.id)
            .collection('comments')
            .orderBy('timestamp', 'asc')
    )

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
            return commentsSnapshot.docs.map((comment) => (
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
                        />
                    )}
                </div>

                {/* Comment counter */}
                <p className={commentsApiClass.counter}>
                    {commentsSnapshot
                        ? commentsSnapshot.docs.length
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
