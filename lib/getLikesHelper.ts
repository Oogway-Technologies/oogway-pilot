import {db} from "../firebase";
import {findLikes} from "../utils/helpers/common";

/**
 *
 * @param id
 * @param setNumLikes setState function for saving likes
 * @description to fetch likes of the post from Firebase.
 */
export const getLikes = (id: string, setNumLikes: (n: number) => void): void => {
    db.collection("posts")
        .doc(id)
        .onSnapshot((snapshot) => {
            findLikes(snapshot, setNumLikes)
        });
}

export const getLikesForCommentEngagementBar = (postId: string, commentId: string, setNumLikes: (n: number) => void): void => {
    db.collection("posts")
        .doc(postId)
        .collection("comments")
        .doc(commentId)
        .onSnapshot((snapshot) => {
            findLikes(snapshot, setNumLikes)
        });
}

export const getLikesForReplyEngagementBar = (postId: string, commentId: string, replyId: string, setNumLikes: (n: number) => void): void => {
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


