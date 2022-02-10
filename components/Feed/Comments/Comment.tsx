import { useState } from 'react'
import { commentClass } from '../../../styles/feed'
import { CardMedia, Collapse, useMediaQuery } from '@mui/material'
import CommentHeader from './CommentHeader'
import CommentEngagementBar from './CommentEngagementBar'
import NewReplyForm from '../Forms/NewReplyForm'
import RepliesAPI from '../Replies/RepliesAPI'
import Modal from '../../Utils/Modal'

// TODO: Needs type interface
function Comment({ commentOwner, postId, commentId, comment }) {
    const [isOpen, setIsOpen] = useState(false)

    // Track comment reply form visibility
    const [expandedReplyForm, setExpandedReplyForm] = useState(false)

    // Track mobile state
    const isMobile = useMediaQuery('(max-width: 500px)')

    // Modal helper functions
    const openModal = () => {
        setIsOpen(true)
    }

    const closeModal = () => {
        setIsOpen(false)
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
                    email={comment.email}
                    timestamp={comment.timestamp}
                />

                {/* Body */}
                <div className={commentClass.body}>
                    <p className={commentClass.bodyDescription}>
                        {comment.message}
                    </p>
                </div>

                {/* Media */}
                {comment.postImage && (
                    <div className={commentClass.media}>
                        <CardMedia component="img" src={comment.postImage} />
                    </div>
                )}

                {/* Engagement */}
                <CommentEngagementBar
                    postId={postId}
                    commentId={commentId}
                    handleReply={
                        isMobile
                            ? openModal
                            : () => setExpandedReplyForm(!expandedReplyForm)
                    }
                    expanded={expandedReplyForm}
                />

                {/* Reply Form */}
                <Collapse in={expandedReplyForm} timeout="auto" unmountOnExit>
                    <div className={commentClass.replyDropdown}>
                        <NewReplyForm
                            commentId={commentId}
                            placeholder="What would you like to say back?"
                        />
                    </div>
                </Collapse>

                {/* Replies API */}
                <RepliesAPI commentId={commentId} />
            </div>

            <Modal
                children={
                    <NewReplyForm
                        commentId={commentId}
                        placeholder="What would you like to say back?"
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

export default Comment
