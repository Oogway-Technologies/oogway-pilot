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
    expirationTime: string;
    lastSeen: string;
    name: string;
    photoUrl: string;
    provider: string;
    resetProfile: boolean;
    uid: string;
}

export interface FirebaseProfile {
    bio: string;
    dm: boolean;
    lastName: string;
    location: string;
    name: string;
    profilePic: string;
    resetProfile: boolean;
    uid: string;
    username: string;
}
