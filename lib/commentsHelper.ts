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
 * @param commentId comment id
 * @description Retrieves a static version of the comment document from firebase
 */

export const getComment = async (commentId: string) => {
    // Retrieve reference to parent post
    const postRef = doc(db, 'post-activity', commentId)
    return await getDoc(postRef)
}

/**
 *
 * @param id parent post id
 * @description Retrieves a static version of the comments docs from firebase
 */

export const getCommentsCollection = async (id: string) => {
    // Retrieve reference to parent post
    return await getDocs(
        query(collection(db, 'post-activity'), where('postId', '==', id))
    )
}

/**
 *
 * @param id parent post id
 * @param snapshot a side-effect function to be called using the returned snapshot
 * @param error a function specifying how to handle error retrieving the snapshot
 * @description streams the comments collection real time and performs the snapshot function on it.
 */

export const streamCommentsCollection = (
    id: string,
    snapshot: (snap: any) => void,
    error: (err: any) => void
) => {
    const commentsQuery = query(
        collection(db, 'post-activity'),
        where('postId', '==', id),
        where('isComment', '==', true),
        orderBy('timestamp', 'asc')
    )
    return onSnapshot(commentsQuery, snapshot, error)
}

/**
 *
 * @param postId parent post id
 * @param commentId comment id
 * @param snapshot a side-effect function to be called using the returned snapshot
 * @param error a function specifying how to handle error retrieving the snapshot
 * @description streams the comment data real time and performs the snapshot function on it.
 */

export const streamCommentData = (
    commentId: string,
    snapshot: (snap: any) => void,
    error: (err: any) => void
) => {
    const commentRef = doc(db, `post-activity/${commentId}`)
    return onSnapshot(commentRef, snapshot, error)
}
