import {FieldValue} from "firebase/firestore";
export interface FirebaseUserProfile {
    provider: string;
    uid: string;
    email: string;
    expirationTime: string;
    resetProfile: boolean;
    photoUrl: string;
    lastSeen: string;
    name: string;
}

export interface FirebaseUser {
    email: string;
    lastSeen: FieldValue;
    name: string;
    provider: string;
    blockedUsers: string[];
    posts: string[];
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
}
