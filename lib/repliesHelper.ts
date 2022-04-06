import {
    collection,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    where,
} from 'firebase/firestore'

import { db } from '../services/firebase'

/**
 *
 * @param replyId reply id
 * @description Retrieves a static version of the comment document from firebase
 */

export const getReply = async (replyId: string) => {
    // Retrieve reference to parent post
    const replyRef = doc(db, 'post-activity', replyId)
    return await getDoc(replyRef)
}

/**
 *
 * @param commentId comment id
 * @description Retrieves a static version of the replies collection from firebase
 */

export const getRepliesCollection = async (commentId: string) => {
    // Retrieve reference to parent post
    const repliesRef = query(
        collection(db, 'post-activity'),
        where('parentId', '==', commentId),
        where('isComment', '==', false)
    )
    return await getDocs(repliesRef)
}

/**
 *
 * @param postId parent post id
 * @param snapshot a side-effect function to be called using the returned snapshot
 * @param error a function specifying how to handle error retrieving the snapshot
 * @description streams the replies collection real time and performs the snapshot function on it.
 */

export const streamRepliesCollection = (
    commentId: string,
    snapshot: (snap: any) => void,
    error: (err: any) => void
) => {
    const repliesQuery = query(
        collection(db, 'post-activity'),
        where('parentId', '==', commentId),
        where('isComment', '==', false),
        orderBy('timestamp', 'asc')
    )

    return onSnapshot(repliesQuery, snapshot, error)
}

/**
 *
 * @param replyId reply id
 * @param snapshot a side-effect function to be called using the returned snapshot
 * @param error a function specifying how to handle error retrieving the snapshot
 * @description streams the reply data real time and performs the snapshot function on it.
 */

export const streamReplyData = (
    replyId: string,
    snapshot: (snap: any) => void,
    error: (err: any) => void
) => {
    const replyRef = doc(db, `post-activity/${replyId}`)
    return onSnapshot(replyRef, snapshot, error)
}
