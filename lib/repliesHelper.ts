import { collection, getDocs, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";

/**
 *
 * @param postId post id
 * @param commentId comment id
 * @description Retrieves a static version of the replies collection from firebase 
 */
 export const getRepliesCollection = async (postId: string, commentId: string) => {
    // Retrieve reference to parent post
    const repliesRef = collection(db, "posts", postId, "comments", commentId, "replies")
    return await getDocs(repliesRef);
}

/**
 *
 * @param postId parent post id
 * @param commentId parent comment id
 * @param snapshot a side-effect function to be called using the returned snapshot
 * @param error a function specifying how to handle error retrieving the snapshot
 * @description streams the replies collection real time and performs the snapshot function on it.
 */
 export const streamRepliesCollection = (
    postId: string,
    commentId: string, 
    snapshot: (snap: firebase.firestore.snapshot) => void, 
    error: (err: any) => void
) => {
    const commentsRef = collection(db, "posts", postId, "comments", commentId, "replies")
    const commentsQuery = query(commentsRef, orderBy('timestamp', 'asc'))
    return onSnapshot(commentsQuery, snapshot, error)
}
