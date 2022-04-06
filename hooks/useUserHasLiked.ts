import { doc, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'

import { db } from '../services/firebase'

/**
 *
 * @param docPath string, path that points to document whose data will be streamed
 * @param userId user id
 * @description tracks whether user currently likes the post, commment or reply
 */

export const useUserHasLiked = (docPath: string, userId: string) => {
    // Track number of likes
    const [userHasLiked, setUserHasLiked] = useState(false)

    // Use useEffect to bind on document loading the
    // function that will track whether user has liked
    // a post, comment, or reply
    useEffect(() => {
        const docRef = doc(db, docPath)
        const unsubscribe = onSnapshot(
            docRef,
            snapshot => {
                if (snapshot.exists()) {
                    // get a reference to the doc
                    const docData = snapshot.data()

                    // Update user has liked state
                    if (userId in docData.likes) setUserHasLiked(true)
                    else setUserHasLiked(false)
                }
            },
            err => {
                console.log(err)
            }
        )

        // Clean up connection to db
        return unsubscribe
    }, [docPath, userId])

    return [userHasLiked, setUserHasLiked] as const
}
