import React from 'react'
import { useCollection } from 'react-firebase-hooks/firestore'
import { db } from '../../../firebase'
import { useRouter } from 'next/router'
import Reply from './Reply'
import { repliesApiClass } from '../../../styles/feed'
import { collection, orderBy, query } from 'firebase/firestore'
import { replyConverter } from '../../../utils/types/firebase'

type RepliesAPIProps = {
    commentId: string
}

const RepliesAPI: React.FC<RepliesAPIProps> = ({ commentId }) => {
    const router = useRouter()

    // Get a snapshot of the replies from the DB
    const [repliesSnapshot] = useCollection(
        query(
            collection(
                db,
                `posts/${router.query.id}/comments/${commentId}/replies`
            ).withConverter(replyConverter),
            orderBy('timestamp', 'asc')
        )
    )

    const showReplies = () => {
        if (repliesSnapshot) {
            return repliesSnapshot?.docs.map((reply) => (
                <Reply
                    key={reply.id}
                    replyOwner={reply.data().authorUid}
                    postId={router.query.id}
                    commentId={commentId}
                    replyId={reply.id}
                    reply={{
                        ...reply.data(),
                        timestamp: reply.data().timestamp,
                    }}
                />
            ))
        }
    }

    return <div className={repliesApiClass.outerDiv}>{showReplies()}</div>
}

export default RepliesAPI
