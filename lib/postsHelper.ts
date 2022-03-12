import { doc, getDoc, onSnapshot } from 'firebase/firestore'

import { db } from '../firebase'

/**
 *
 * @param id post id
 * @description Retrieves a static version of the post document from firebase
 */

export const getPost = async (id: string) => {
    // Retrieve reference to parent post
    const postRef = doc(db, 'posts', id)
    return await getDoc(postRef)
}

/**
 *
 * @param id post id
 * @param snapshot a side-effect function to be called using the returned snapshot
 * @param error a function specifying how to handle error retrieving the snapshot
 * @description streams the post real time and performs the snapshot function on it.
 */

export const streamPostData = (
    id: string,
    snapshot: (snap: any) => void,
    error: (err: any) => void
) => {
    const postRef = doc(db, 'posts', id)
    return onSnapshot(postRef, snapshot, error)
}
