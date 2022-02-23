import { FC, useState } from 'react'
import { commentClass } from '../../../styles/feed'
import { CardMedia, Collapse, useMediaQuery } from '@mui/material'
import CommentHeader from './CommentHeader'
import CommentEngagementBar from './CommentEngagementBar'
import NewReplyForm from '../Forms/NewReplyForm'
import RepliesAPI from '../Replies/RepliesAPI'
import Modal from '../../Utils/Modal'
import { useUser } from '@auth0/nextjs-auth0'
import { FirebaseComment } from '../../../utils/types/firebase'

interface CommentProps {
    commentOwner: string
    postId: string
    commentId: string
    comment: FirebaseComment
}

const Comment: FC<CommentProps> = ({
    commentOwner,
    postId,
    commentId,
    comment,
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
            return null
        } else {
            isMobile ? openModal() : setExpandedReplyForm(!expandedReplyForm)
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
                    handleReply={handleReply}
                    expanded={expandedReplyForm}
                />

                {/* Reply Form */}
                <Collapse in={expandedReplyForm} timeout="auto" unmountOnExit>
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
