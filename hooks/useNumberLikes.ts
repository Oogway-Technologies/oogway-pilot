import { useEffect, useState } from 'react'

import {
    getDislikesForCommentEngagementBar,
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
        getLikesForCommentEngagementBar(commentId, setNumLikes)
        return () => {
            setNumLikes(0)
        }
    }, [postId, commentId])

    return [numLikes, setNumLikes] as const
}

export const useCommentNumberDislikes = (postId: string, commentId: string) => {
    // Track number of dislikes
    const [numDislikes, setNumDislikes] = useState(0)

    // Use useEffect to bind on document loading the
    // function that will set the number of dislikes on
    // each change of the DB (triggered by onSnapshot)
    useEffect(() => {
        getDislikesForCommentEngagementBar(commentId, setNumDislikes)
        return () => {
            setNumDislikes(0)
        }
    }, [postId, commentId])

    return [numDislikes, setNumDislikes] as const
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
        getLikesForReplyEngagementBar(replyId, setNumLikes)
        return () => {
            setNumLikes(0)
        }
    }, [postId, commentId, replyId])

    return [numLikes, setNumLikes] as const
}
