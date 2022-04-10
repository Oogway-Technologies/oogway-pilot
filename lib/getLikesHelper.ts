import { UserProfile } from '@auth0/nextjs-auth0/src/frontend/use-user'
import { DocumentData, DocumentSnapshot, updateDoc } from 'firebase/firestore'

import { findDislikes, findLikes } from '../utils/helpers/common'
import { FirebaseProfile } from '../utils/types/firebase'
import { streamCommentData } from './commentsHelper'
import { streamPostData } from './postsHelper'
import { streamReplyData } from './repliesHelper'

/**
 *
 * @param id
 * @param setNumLikes setState function for saving likes
 * @description to fetch likes of the post from Firebase.
 */

export const getLikes = (
    id: string,
    setNumLikes: (n: number) => void
): void => {
    streamPostData(
        id,
        snapshot => {
            findLikes(snapshot, setNumLikes)
        },
        err => console.log(err)
    )
}

export const getLikesForCommentEngagementBar = (
    commentId: string,
    setNumLikes: (n: number) => void
): void => {
    streamCommentData(
        commentId,
        snapshot => {
            findLikes(snapshot, setNumLikes)
        },
        err => console.log(err)
    )
}

// Only works for Oogway AI Bot comments, otherwise returns 0
export const getDislikesForCommentEngagementBar = (
    commentId: string,
    setNumDislikes: (n: number) => void
): void => {
    streamCommentData(
        commentId,
        snapshot => {
            findDislikes(snapshot, setNumDislikes)
        },
        err => console.log(err)
    )
}

export const getLikesForReplyEngagementBar = (
    replyId: string,
    setNumLikes: (n: number) => void
): void => {
    streamReplyData(
        replyId,
        snapshot => {
            findLikes(snapshot, setNumLikes)
        },
        err => console.log(err)
    )
}

export const addLike = (
    user: UserProfile | undefined,
    userProfile: FirebaseProfile,
    docSnap: Promise<DocumentSnapshot<DocumentData>>
): void => {
    // Return early for unathenticated users
    if (!user) {
        return
    }

    // Add Like
    docSnap.then(doc => {
        // Here goes the logic for toggling likes from each user
        if (doc.exists()) {
            // Get a reference to the doc
            const tmp = doc.data()

            // Step 1: check if user.uid is in the list
            if (userProfile.uid in tmp.likes) {
                // Remove user from map

                delete tmp.likes[userProfile.uid]
            } else {
                // Add user to array
                tmp.likes[userProfile.uid] = true

                // Remove user from dislikes for Oogway AI bot comments
                if (
                    typeof tmp.dislikes !== 'undefined' &&
                    userProfile.uid in tmp.dislikes
                ) {
                    delete tmp.dislikes[userProfile.uid]
                }
            }

            // Update doc
            // Note: a simple update here is fine.
            // No need for a transaction, since even if a like is lost,
            // That event is very rare and probably not so much of a pain
            updateDoc(doc.ref, tmp)
        } else {
            console.log('Error document not found: ' + doc.id)
        }
    })
}

// Only works for Oogway AI bot comments
export const addDislike = (
    user: UserProfile | undefined,
    userProfile: FirebaseProfile,
    docSnap: Promise<DocumentSnapshot<DocumentData>>
): void => {
    // Return early for unathenticated users
    if (!user) {
        return
    }

    // Add dislike
    docSnap.then(doc => {
        // Return early if docSnap doesn't contain dislikes map
        if (doc.exists() && doc.data().dislikes === null) return

        if (doc.exists()) {
            // Get a reference to the doc
            const tmp = doc.data()

            // Step 1: check if user.uid is in the list
            if (userProfile.uid in tmp.dislikes) {
                // Remove user from map
                delete tmp.dislikes[userProfile.uid]
            } else {
                // Add user to array
                tmp.dislikes[userProfile.uid] = true

                // Remove user from likes map
                if (userProfile.uid in tmp.likes) {
                    delete tmp.likes[userProfile.uid]
                }
            }

            // Update doc
            // Note: a simple update here is fine.
            // No need for a transaction, since even if a like is lost,
            // That event is very rare and probably not so much of a pain
            updateDoc(doc.ref, tmp)
        } else {
            console.log('Error document not found: ' + doc.id)
        }
    })
}
