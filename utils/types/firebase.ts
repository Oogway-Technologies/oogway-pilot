import {
    DocumentData,
    FieldValue,
    QueryDocumentSnapshot,
    SnapshotOptions,
} from 'firebase/firestore'

import { MediaObject } from './global'

/**
 * Firebase collection field types
 */
export type blockedUsersMap = { [id: string]: boolean }

export type postsMap = { [id: string]: boolean }

export type userMap = { [uid: string]: boolean }

export type compare = {
    objList: Array<MediaObject>
    votesObjMapList: Array<userMap>
}

/**
 * Fire base collection interfaces
 */
export interface FirebaseReply {
    id?: string
    postId?: string
    parentId?: string | null
    isComment: boolean
    message: string
    author: string
    authorUid: string
    timestamp: FieldValue
    likes: userMap
}

export interface FirebaseComment {
    id?: string
    postId?: string
    parentId?: string | null
    isComment: boolean
    message: string | undefined
    author: string
    authorUid: string
    likes: userMap
    postImage?: string | null
    timestamp: FieldValue
}

export interface FirebasePost {
    id?: string
    compare?: compare
    description: string
    message: string
    feed?: string | undefined
    isCompare: boolean
    likes: userMap
    name: string
    timestamp: FieldValue
    postImage?: string | null
    previewImage?: string
    uid: string
    isAnonymous: boolean
}

export interface FirebaseUser {
    email: string
    lastSeen: FieldValue
    name: string
    provider: string
    blockedUsers: blockedUsersMap
    posts: postsMap
    auth0: string
}

export interface FirebaseProfile {
    bio: string
    dm: boolean
    lastName: string
    location: string
    name: string
    profilePic: string
    resetProfile: boolean
    username: string
    uid: string
}

export interface FirebaseFeed {
    id?: string
    label: string
    timestamp: FieldValue
    createdBy: string
}

export type engagementAction = 'like' | 'comment' | 'reply' | 'vote'

export type engagementTarget = 'Poll' | 'Comment' | 'Reply' | 'Post'

export interface FirebaseEngagement {
    id?: string
    engagerId: string
    engageeId: string
    action: engagementAction
    timestamp?: FieldValue
    targetId: string
    targetObject: engagementTarget
    targetRoute: string
    isNew: boolean
}

export interface FirebaseEngagementFragment {
    engagerId?: string
    engageeId?: string
    action?: engagementAction
    timestamp?: FieldValue
    targetId?: string
    targetObject?: engagementTarget
    targetRoute?: string
    isNew?: boolean
}

/**
 * Type converters for Firebase Snapshots
 * See: https://firebase.google.com/docs/reference/js/v8/firebase.firestore.FirestoreDataConverter
 */
export const commmentConverter = {
    toFirestore(comment: FirebaseComment): DocumentData {
        return {
            id: comment.id,
            postId: comment.postId,
            parentId: comment.parentId,
            isComment: comment.isComment,
            message: comment.message,
            author: comment.author,
            authorUid: comment.authorUid,
            likes: comment.likes,
            postImage: comment.postImage,
            timestamp: comment.timestamp,
        }
    },
    fromFirestore(
        snapshot: QueryDocumentSnapshot,
        options: SnapshotOptions
    ): FirebaseComment {
        const data = snapshot.data(options)
        return {
            id: data.id,
            postId: data.postId,
            parentId: data.parentId,
            isComment: data.isComment,
            message: data.message,
            author: data.author,
            authorUid: data.authorUid,
            likes: data.likes,
            postImage: data.postImage ? data.postImage : null,
            timestamp: data.timestamp,
        }
    },
}

export const replyConverter = {
    toFirestore(reply: FirebaseReply): DocumentData {
        return {
            id: reply.id,
            postId: reply.postId,
            parentId: reply.parentId,
            isComment: reply.isComment,
            message: reply.message,
            author: reply.author,
            authorUid: reply.authorUid,
            likes: reply.likes,
            timestamp: reply.timestamp,
        }
    },
    fromFirestore(
        snapshot: QueryDocumentSnapshot,
        options: SnapshotOptions
    ): FirebaseReply {
        const data = snapshot.data(options)
        return {
            id: data.id,
            postId: data.postId,
            parentId: data.parentId,
            isComment: data.isComment,
            message: data.message,
            author: data.author,
            authorUid: data.authorUid,
            likes: data.likes,
            timestamp: data.timestamp,
        }
    },
}
