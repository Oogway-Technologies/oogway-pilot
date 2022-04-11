import { useUser } from '@auth0/nextjs-auth0'
import firebase from 'firebase/compat/app'
import { collection, orderBy, query, where } from 'firebase/firestore'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useCollection } from 'react-firebase-hooks/firestore'

import { db } from '../../../firebase'
import useMediaQuery from '../../../hooks/useMediaQuery'
import { usePostNumberComments } from '../../../hooks/useNumberComments'
import { useAppSelector } from '../../../hooks/useRedux'
import { commentFormClass, commentsApiClass } from '../../../styles/feed'
import {
    adviceBotId,
    demoAccountIdDev,
    demoAccountIdProd,
} from '../../../utils/constants/global'
import {
    commmentConverter,
    FirebaseComment,
} from '../../../utils/types/firebase'
import { staticPostData } from '../../../utils/types/params'
import Button from '../../Utils/Button'
import { Avatar } from '../../Utils/common/Avatar'
import Modal from '../../Utils/Modal'
import NewCommentForm from '../Forms/NewCommentForm'
import Comment from './Comment'

type CommentsAPIProps = {
    comments: firebase.firestore.QueryDocumentSnapshot
    parentPostData: staticPostData
}

const CommentsAPI: React.FC<CommentsAPIProps> = ({
    comments,
    parentPostData,
}) => {
    // Retrieve user profile
    const userProfile = useAppSelector(state => state.userSlice.user)
    const { user } = useUser()

    // Get a snapshot of the comments from the DB
    const router = useRouter()
    const [commentsSnapshot] = useCollection(
        query(
            collection(db, 'post-activity'),
            where('postId', '==', router.query.id),
            where('isComment', '==', true),
            orderBy('timestamp', 'asc')
        ).withConverter(commmentConverter)
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
            return commentsSnapshot?.docs.map(comment => {
                // Only show oogway AI bot comments to Demo account
                if (
                    comment.data().authorUid === adviceBotId &&
                    userProfile.uid !== (demoAccountIdDev || demoAccountIdProd)
                )
                    return
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
                        parentPostData={parentPostData}
                    />
                )
            })
        } else {
            // Visualize the server-side rendered comments
            return JSON.parse(comments.toString()).map(
                (comment: FirebaseComment) => {
                    // Only show oogway AI bot comments to Demo account
                    console.log(
                        `Checking boolean is false: ${
                            userProfile.uid !== demoAccountIdDev ||
                            userProfile.uid !== demoAccountIdProd
                        }`
                    )
                    if (
                        comment.authorUid === adviceBotId &&
                        (userProfile.uid !== demoAccountIdDev ||
                            userProfile.uid !== demoAccountIdProd)
                    )
                        return

                    return (
                        <Comment
                            key={comment.id}
                            commentOwner={comment.authorUid}
                            postId={router.query.id as string}
                            commentId={comment?.id || ''}
                            comment={comment}
                            parentPostData={parentPostData}
                        />
                    )
                }
            )
        }
    }
    const showCommentForm = () => {
        return (
            <>
                <Avatar
                    src={userProfile?.profilePic ? userProfile.profilePic : ''}
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
                        parentPostData={parentPostData}
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
                    {numComments === 0 && !user
                        ? `No Answers.`
                        : numComments === 0
                        ? `No Answers. Be the first.`
                        : numComments === 1
                        ? `${numComments} Answer`
                        : `${numComments} Answers`}
                </p>

                {/* Post's Comments */}
                {showComments()}
            </div>

            <Modal show={isOpen} onClose={closeModal}>
                <NewCommentForm
                    placeholder={
                        userProfile?.name
                            ? `What do you think, ${userProfile.name}?`
                            : 'What do you think?'
                    }
                    closeModal={closeModal}
                    isMobile={isMobile}
                    parentPostData={parentPostData}
                />
            </Modal>
        </>
    )
}

export default CommentsAPI
