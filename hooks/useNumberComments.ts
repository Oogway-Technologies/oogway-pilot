import { useEffect, useState } from 'react'

import { streamCommentsCollection } from '../lib/commentsHelper'
import { streamRepliesCollection } from '../lib/repliesHelper'

export const usePostNumberComments = (id: string) => {
    // Track number of comments
    const [numComments, setNumComments] = useState(0)

    // Use useEffect to bind on document loading the
    // function that will set the number of comments on
    // each change of the DB (triggered by onSnapshot)
    useEffect(() => {
        const unsubscribe = streamCommentsCollection(
            id,
            querySnapshot => {
                setNumComments(querySnapshot.docs.length || 0)
            },
            error => {
                console.log(error)
            }
        )
        return () => {
            setNumComments(0)
            unsubscribe()
        }
    }, [id])

    return [numComments, setNumComments] as const
}

export const useCommentNumberReplies = (postId: string, commentId: string) => {
    // Track number of comments
    const [numReplies, setNumReplies] = useState(0)

    // Use useEffect to bind on document loading the
    // function that will set the number of comments on
    // each change of the DB (triggered by onSnapshot)

    useEffect(() => {
        const unsubscribe = streamRepliesCollection(
            commentId,
            querySnapshot => {
                setNumReplies(querySnapshot.docs.length || 0)
            },
            error => {
                console.log(error)
            }
        )
        return () => {
            setNumReplies(0)
            unsubscribe()
        }
    }, [postId, commentId])

    return [numReplies, setNumReplies] as const
}
