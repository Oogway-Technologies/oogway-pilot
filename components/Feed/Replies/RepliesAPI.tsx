import { collection, orderBy, query, where } from 'firebase/firestore'
import { useRouter } from 'next/router'
import React from 'react'
import { useCollection } from 'react-firebase-hooks/firestore'

import { db } from '../../../services/firebase'
import { repliesApiClass } from '../../../styles/feed'
import { replyConverter } from '../../../utils/types/firebase'
import { staticPostData } from '../../../utils/types/params'
import Reply from './Reply'

type RepliesAPIProps = {
    commentId: string
    parentPostData: staticPostData
}

const RepliesAPI: React.FC<RepliesAPIProps> = ({
    commentId,
    parentPostData,
}) => {
    const router = useRouter()

    // Get a snapshot of the replies from the DB
    const [repliesSnapshot] = useCollection(
        query(
            collection(db, 'post-activity'),
            where('parentId', '==', commentId),
            where('isComment', '==', false),
            orderBy('timestamp', 'asc')
        ).withConverter(replyConverter)
    )

    return (
        <div className={repliesApiClass.outerDiv}>
            {repliesSnapshot &&
                repliesSnapshot?.docs.map(reply => (
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
                        parentPostData={parentPostData}
                    />
                ))}
        </div>
    )
}

export default RepliesAPI
