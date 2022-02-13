import { useEffect, useState } from 'react'
import { streamRepliesCollection } from '../lib/repliesHelper'


export const useReplies = (postId: string | string[] | undefined, commentId: string) => {
    if (!postId || !commentId) {
        return
    }
    // track replies
    const [repliesSnapshot, setRepliesSnapshot] = useState()

    // Use useEffect to bind on document loading the
    // function that will store replies and update on
    // each change of the DB (triggered by onSnapshot)
    useEffect(() => {
        const unsubscribe = streamRepliesCollection(
            postId, 
            commentId,
            (querySnapshot) => {
                // Fetch comments
                setRepliesSnapshot(querySnapshot.docs)
            },
            (error) => {console.log(error)}
        )
        return unsubscribe;
    }, [postId, commentId, setRepliesSnapshot])

    return [repliesSnapshot, setRepliesSnapshot] as const
}