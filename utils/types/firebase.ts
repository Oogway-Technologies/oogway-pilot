import {
    DocumentData,
    FieldValue,
    QueryDocumentSnapshot,
    SnapshotOptions,
} from 'firebase/firestore'

import { BingReference } from './bingapi'
import { Criteria, MediaObject, Options, Rating, Ratings } from './global'
import { GoogleSearchHyperlink } from './googleapi'

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

export interface AIBotComment extends FirebaseComment {
    dislikes: userMap
    filterStatus: '0' | '1' | '2'
    references: BingReference[] | null
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
    timestamp: FieldValue
    ipAddresses?: string[]
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

export type decisionCriteria = {
    name: string
    weight: number
    isAI: boolean
}

export type decisionOption = {
    name: string
    isAI: boolean
    score: number
}

export type decisionRating = {
    option: string
    score: string
    rating: Rating[]
}

export interface FirebaseDecisionActivity {
    [index: string]:
        | string
        | decisionCriteria[]
        | decisionOption[]
        | Options[]
        | Criteria[]
        | decisionRating[]
        | Ratings[]
        | FieldValue
        | boolean
        | number
        | undefined
        | null
    id?: string
    userId?: string
    ipAddress?: string
    question?: string
    context?: string
    criteria?: decisionCriteria[]
    options?: decisionOption[]
    suggestedOptions?: Options[] | null
    suggestedCriteria?: Criteria[] | null
    ratings?: decisionRating[] | Ratings[]
    timestamp?: FieldValue
    isComplete?: boolean
    isQuestionSafeForAI?: boolean
    userIgnoredUnsafeWarning?: boolean
    clickedConnect?: boolean
    currentTab?: 0 | 1 | 2 | 3 | 4 | 5
}

export interface FirebaseDecisionContext {
    version?: string // Version of decision criteria info AI API
    decision: string
    option: string
    criterion: string
    timestamp?: FieldValue
}

export interface FirebaseDecisionCriteriaInfo {
    id?: string
    fact: string
    url_list: GoogleSearchHyperlink[]
    query: string

    timestamp?: FieldValue
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

export interface FirebaseUnauthenticatedDecision {
    id?: string // user ipAddress
    decisions: string[]
    createdAt?: FieldValue
    updatedAt?: FieldValue
}

/**
 * Type guards
 */

export const isAIBotComment = (x: any): x is AIBotComment =>
    'dislikes' in x && 'filterStatus' in x && 'references' in x

/**
 * Type converters for Firebase Snapshots
 * See: https://firebase.google.com/docs/reference/js/v8/firebase.firestore.FirestoreDataConverter
 */
export const commmentConverter = {
    toFirestore(comment: FirebaseComment | AIBotComment): DocumentData {
        let data: FirebaseComment | AIBotComment = {
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
        if (isAIBotComment(comment)) {
            data = {
                ...data,
                filterStatus: comment.filterStatus,
                references: comment.references,
                dislikes: comment.dislikes,
            }
        }
        return data
    },
    fromFirestore(
        snapshot: QueryDocumentSnapshot,
        options: SnapshotOptions
    ): FirebaseComment | AIBotComment {
        const data = snapshot.data(options)

        // Create base comment
        let comment: FirebaseComment | AIBotComment = {
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
        if (typeof data.references !== 'undefined') {
            comment = {
                ...comment,
                references: data.references,
                filterStatus: data.filterStatus,
                dislikes: data.dislikes,
            }
        }
        return comment
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

export const userConverter = {
    toFirestore(user: FirebaseUser): DocumentData {
        return {
            email: user.email,
            lastSeen: user.lastSeen,
            name: user.name,
            provider: user.provider,
            blockedUsers: user.blockedUsers,
            posts: user.posts,
            auth0: user.auth0,
            timestamp: user.timestamp,
            ipAddresses: user.ipAddresses ? user.ipAddresses : [],
        }
    },
    fromFirestore(
        snapshot: QueryDocumentSnapshot,
        options: SnapshotOptions
    ): FirebaseUser {
        const data = snapshot.data(options)
        return {
            email: data.email,
            lastSeen: data.lastSeen,
            name: data.name,
            provider: data.provider,
            blockedUsers: data.blockedUsers,
            posts: data.posts,
            auth0: data.auth0,
            timestamp: data.timestamp,
            ipAddresses: data.ipAddresses ? data.ipAddresses : [],
        }
    },
}
