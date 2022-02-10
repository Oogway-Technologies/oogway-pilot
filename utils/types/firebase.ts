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
