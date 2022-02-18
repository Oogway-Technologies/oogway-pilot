import {FieldValue} from "firebase/firestore";

export type blockedUsersMap = {[id: string] : boolean}

export type postsMap = {[id: string] : boolean}

export type userMap = {[uid: string]: boolean}

export type compareObj = {
    type: 'text' | 'image'
    value: string
}

export type compare = {
    objList: Array<compareObj>
    votesObjMapList: Array<userMap>
}

export interface FirebasePost {
    id: string
    compare?: compare
    description: string
    message: string
    isCompare: boolean
    likes: userMap
    name: string 
    timestamp: Date
    postImage: string | null
    previewImage?: string
    uid: string
}

export interface FirebaseUser {
    email: string;
    lastSeen: FieldValue;
    name: string;
    provider: string;
    blockedUsers: blockedUsersMap;
    posts: postsMap;
    auth0: string;
}

export interface FirebaseProfile {
    bio: string;
    dm: boolean;
    lastName: string;
    location: string;
    name: string;
    profilePic: string;
    resetProfile: boolean;
    username: string;
    uid: string;
}
