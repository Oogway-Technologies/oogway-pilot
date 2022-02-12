import { UserProfile } from "@auth0/nextjs-auth0/src/frontend/use-user";
import { DocumentData, DocumentSnapshot, updateDoc } from "firebase/firestore";
import {db} from "../firebase";
import {findLikes} from "../utils/helpers/common";
import { FirebaseProfile } from "../utils/types/firebase";

/**
 *
 * @param id
 * @param setNumLikes setState function for saving likes
 * @description to fetch likes of the post from Firebase.
 */
export const getLikes = (id: string, setNumLikes: (n: number) => void): void => {
    // TODO: Refactor
    db.collection("posts")
        .doc(id)
        .onSnapshot((snapshot) => {
            findLikes(snapshot, setNumLikes)
        });
}

export const getLikesForCommentEngagementBar = (postId: string, commentId: string, setNumLikes: (n: number) => void): void => {
    // TODO: Refactor
    db.collection("posts")
        .doc(postId)
        .collection("comments")
        .doc(commentId)
        .onSnapshot((snapshot) => {
            findLikes(snapshot, setNumLikes)
        });
}

export const getLikesForReplyEngagementBar = (postId: string, commentId: string, replyId: string, setNumLikes: (n: number) => void): void => {
    // TODO: Refactor
    db.collection("posts")
        .doc(postId)
        .collection("comments")
        .doc(commentId)
        .collection("replies")
        .doc(replyId)
        .onSnapshot((snapshot) => {
            findLikes(snapshot, setNumLikes)
        });
}

export const addLike = (user: UserProfile | undefined, userProfile: FirebaseProfile, docSnap: Promise<DocumentSnapshot<DocumentData>>) => {
        // Return early for unathenticated users
        // TODO: trigger a popover that tells users they must be
        // logged in to engage and point them to registration?
        if (!user) {
            return
        }

        // Add Like
        docSnap.then((doc) => {
            // Here goes the logic for toggling likes from each user
            if (doc.exists()) {
                // Get a reference to the doc
                let tmp = doc.data()

                // Step 1: check if user.uid is in the list
                if (userProfile.uid in tmp.likes) {
                    // Negate what the user previously did
                    tmp.likes[userProfile.uid] = !tmp.likes[userProfile.uid]
                } else {
                    // The user liked the comment
                    tmp.likes[userProfile.uid] = true
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
