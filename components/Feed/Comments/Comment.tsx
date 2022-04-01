import { useUser } from '@auth0/nextjs-auth0'
import React, { FC, useState } from 'react'
import Linkify from 'react-linkify'

import useMediaQuery from '../../../hooks/useMediaQuery'
import { commentClass } from '../../../styles/feed'
import { cardMediaStyle } from '../../../styles/utils'
import { isValidURL } from '../../../utils/helpers/common'
import { FirebaseComment } from '../../../utils/types/firebase'
import { staticPostData } from '../../../utils/types/params'
import { Collapse } from '../../Utils/common/Collapse'
import Modal from '../../Utils/Modal'
import { PreviewDecider } from '../../Utils/PreviewDecider'
import NewReplyForm from '../Forms/NewReplyForm'
import RepliesAPI from '../Replies/RepliesAPI'
import CommentEngagementBar from './CommentEngagementBar'
import CommentHeader from './CommentHeader'

interface CommentProps {
    commentOwner: string
    postId: string
    commentId: string
    comment: FirebaseComment
    parentPostData: staticPostData
}

const Comment: FC<CommentProps> = ({
    commentOwner,
    postId,
    commentId,
    comment,
    parentPostData,
}) => {
    // Retrieve auth state
    const { user } = useUser()

    // Track comment reply form visibility
    const [expandedReplyForm, setExpandedReplyForm] = useState(false)

    // Track mobile state
    const isMobile = useMediaQuery('(max-width: 500px)')

    // Modal helper functions
    const [isOpen, setIsOpen] = useState(false)

    const openModal = () => {
        setIsOpen(true)
    }

    const closeModal = () => {
        setIsOpen(false)
    }

    // Reply button handler
    const handleReply = () => {
        if (!user) {
            // TODO: Add a generic popover telling
            // anonymous users they must login with a link to log-in
            return
        } else {
            if (isMobile) {
                openModal()
            } else {
                setExpandedReplyForm(!expandedReplyForm)
            }
        }
    }

    return (
        <>
            <div className={commentClass.outerDiv}>
                {/* Header */}
                <CommentHeader
                    postId={postId}
                    commentId={commentId}
                    authorUid={commentOwner}
                    name={comment.author}
                    timestamp={comment.timestamp}
                    parentPostData={parentPostData}
                />

                {/* Body */}
                <div className={commentClass.body}>
                    {isValidURL(comment.message) ? (
                        <Linkify
                            componentDecorator={(
                                decoratedHref,
                                decoratedText,
                                key
                            ) => (
                                <a
                                    className={
                                        'pr-sm ml-0 text-sm text-neutral-700 dark:text-neutralDark-150 hover:underline whitespace-pre-line break-words'
                                    }
                                    target="blank"
                                    href={decoratedHref}
                                    key={key}
                                >
                                    {decoratedText}
                                </a>
                            )}
                        >
                            <p className={commentClass.bodyDescription}>
                                {comment.message}
                            </p>
                        </Linkify>
                    ) : (
                        <p className={commentClass.bodyDescription}>
                            {comment.message}
                        </p>
                    )}
                </div>

                {/* Media */}
                {comment.postImage && (
                    <div className={commentClass.media}>
                        <img
                            src={comment.postImage}
                            className={cardMediaStyle}
                        />
                    </div>
                )}
                {isValidURL(comment.message) && (
                    <PreviewDecider textToDetect={comment.message || ''} />
                )}

                {/* Engagement */}
                <CommentEngagementBar
                    postId={postId}
                    commentId={commentId}
                    handleReply={handleReply}
                    expanded={expandedReplyForm}
                />

                {/* Reply Form */}
                <Collapse show={expandedReplyForm}>
                    <div className={commentClass.replyDropdown}>
                        <NewReplyForm
                            commentId={commentId}
                            placeholder="What would you like to say back?"
                            closeModal={closeModal}
                            isMobile={isMobile}
                        />
                    </div>
                </Collapse>

                {/* Replies API */}
                <RepliesAPI
                    commentId={commentId}
                    parentPostData={parentPostData}
                />
            </div>

            <Modal show={isOpen} onClose={closeModal}>
                <NewReplyForm
                    commentId={commentId}
                    placeholder="What would you like to say back?"
                    closeModal={closeModal}
                    isMobile={isMobile}
                />
            </Modal>
        </>
    )
}

export default Comment
