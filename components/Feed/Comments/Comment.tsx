import { useUser } from '@auth0/nextjs-auth0'
import { UilInfoCircle } from '@iconscout/react-unicons'
import React, { FC, useState } from 'react'
import Linkify from 'react-linkify'

import useMediaQuery from '../../../hooks/useMediaQuery'
import { commentClass } from '../../../styles/feed'
import { cardMediaStyle } from '../../../styles/utils'
import { isValidURL } from '../../../utils/helpers/common'
import {
    AIBotComment,
    FirebaseComment,
    isAIBotComment,
} from '../../../utils/types/firebase'
import { staticPostData } from '../../../utils/types/params'
import NewReplyForm from '../../Forms/NewReplyForm'
import { Collapse } from '../../Utils/common/Collapse'
import Modal from '../../Utils/Modal'
import { PreviewDecider } from '../../Utils/PreviewDecider'
import { Tooltip } from '../../Utils/Tooltip'
import RepliesAPI from '../Replies/RepliesAPI'
import CommentEngagementBar from './CommentEngagementBar'
import CommentHeader from './CommentHeader'
import AIBotReferences from './references/AIBotReferences'

interface CommentProps {
    commentOwner: string
    postId: string
    commentId: string
    comment: FirebaseComment | AIBotComment
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
    const [isMoreInfoOpen, setIsMoreInfoOpen] = useState(false)

    const openModal = () => {
        setIsOpen(true)
    }
    const openMoreInfo = () => {
        setIsMoreInfoOpen(true)
    }

    const closeModal = () => {
        setIsOpen(false)
    }
    const closeMoreInfo = () => {
        setIsMoreInfoOpen(false)
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
            <div id={`comment-${commentId}`} className={commentClass.outerDiv}>
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
                        <>
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
                            {/* AI Bot references */}
                            {isAIBotComment(comment) && comment.references && (
                                <AIBotReferences
                                    references={comment.references}
                                />
                            )}
                        </>
                    ) : (
                        <>
                            <p className={commentClass.bodyDescription}>
                                {comment.message}
                            </p>
                            {/* AI Bot references */}
                            {isAIBotComment(comment) && comment.references && (
                                <AIBotReferences
                                    references={comment.references}
                                />
                            )}
                        </>
                    )}
                    {/* Display information tooltip for senstive AI bot comments */}
                    {isAIBotComment(comment) && comment.filterStatus === '2' && (
                        <div
                            className={
                                commentClass.bodyDescription + ' mt-sm mr-auto'
                            }
                        >
                            <Tooltip
                                toolTipText={'Why am I seeing this message?'}
                            >
                                <UilInfoCircle
                                    onClick={openMoreInfo}
                                    className="fill-success"
                                />
                            </Tooltip>
                        </div>
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
                    authorUid={commentOwner}
                    handleReply={handleReply}
                    expanded={expandedReplyForm}
                    parentPostData={parentPostData}
                />

                {/* Reply Form */}
                <Collapse show={expandedReplyForm}>
                    <div className={commentClass.replyDropdown}>
                        <NewReplyForm
                            commentId={commentId}
                            placeholder="What would you like to say back?"
                            closeModal={closeModal}
                            isMobile={isMobile}
                            commentOwner={commentOwner}
                        />
                    </div>
                </Collapse>

                {/* Replies API */}
                <RepliesAPI
                    commentId={commentId}
                    commentAuthor={commentOwner}
                    parentPostData={parentPostData}
                />
            </div>

            <Modal show={isOpen} onClose={closeModal}>
                <NewReplyForm
                    commentId={commentId}
                    placeholder="What would you like to say back?"
                    closeModal={closeModal}
                    isMobile={isMobile}
                    commentOwner={commentOwner}
                />
            </Modal>
            <Modal show={isMoreInfoOpen} onClose={closeMoreInfo}>
                <div className={'flex-col w-60 max-w-max sm:w-96'}>
                    <div className={commentClass.bodyDescription}>
                        You are seeing this message because Oogway AI Bot either
                        failed to generate useful advice for you or the content
                        was deemed potentially sensitive.{'\n\n'}Oogway Bot is
                        committed to continual improvement and apologizes for
                        the inconvenience.
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default Comment
