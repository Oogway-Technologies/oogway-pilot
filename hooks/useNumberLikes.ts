import { useEffect, useState } from 'react'
import {
    getLikes,
    getLikesForCommentEngagementBar,
    getLikesForReplyEngagementBar,
} from '../lib/getLikesHelper'

export const usePostNumberLikes = (id: string) => {
    // Track number of likes
    const [numLikes, setNumLikes] = useState(0)

    // Use useEffect to bind on document loading the
    // function that will set the number of likes on
    // each change of the DB (triggered by onSnapshot)
    useEffect(() => {
        getLikes(id, setNumLikes)
        return () => {
            setNumLikes(0)
        }
    }, [id])

    return [numLikes, setNumLikes] as const
}

export const useCommentNumberLikes = (postId: string, commentId: string) => {
    // Track number of likes
    const [numLikes, setNumLikes] = useState(0)

    // Use useEffect to bind on document loading the
    // function that will set the number of likes on
    // each change of the DB (triggered by onSnapshot)
    useEffect(() => {
        getLikesForCommentEngagementBar(postId, commentId, setNumLikes)
        return () => {
            setNumLikes(0)
        }
    }, [postId, commentId])

    return [numLikes, setNumLikes] as const
}

export const useReplyNumberLikes = (
    postId: string,
    commentId: string,
    replyId: string
) => {
    // Track number of likes
    const [numLikes, setNumLikes] = useState(0)

    // Use useEffect to bind on document loading the
    // function that will set the number of likes on
    // each change of the DB (triggered by onSnapshot)
    useEffect(() => {
        getLikesForReplyEngagementBar(postId, commentId, replyId, setNumLikes)
        return () => {
            setNumLikes(0)
        }
    }, [postId, commentId, replyId])

    return [numLikes, setNumLikes] as const
}
