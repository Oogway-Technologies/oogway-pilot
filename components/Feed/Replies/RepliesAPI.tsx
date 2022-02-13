import React from 'react'
import { useCollection } from 'react-firebase-hooks/firestore'
import { db } from '../../../firebase'
import { useRouter } from 'next/router'
import Reply from './Reply'
import { repliesApiClass } from '../../../styles/feed'
import { useReplies } from '../../../hooks/useReplies'

type RepliesAPIProps = {
    commentId: string
}

const RepliesAPI: React.FC<RepliesAPIProps> = ({ commentId }) => {
    const router = useRouter()

    // Get a snapshot of the replies from the DB
    const [repliesSnapshot] = useReplies(router.query.id, commentId)

    const showReplies = () => {
        return (
            <div className={repliesApiClass.outerDiv}>
                {repliesSnapshot.map((reply) => (
                    <Reply
                        key={reply.id}
                        replyOwner={reply.data().authorUid}
                        postId={router.query.id}
                        commentId={commentId}
                        replyId={reply.id}
                        reply={{
                            ...reply.data(),
                            timestamp: reply
                                .data()
                                .timestamp?.toDate()
                                .getTime(),
                        }}
                    />
                ))}
            </div>
        )
    }

    return <>{repliesSnapshot?.length > 0 && showReplies()}</>
}

export default RepliesAPI
