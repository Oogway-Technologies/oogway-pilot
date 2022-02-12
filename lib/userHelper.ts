import {UserProfile} from "@auth0/nextjs-auth0/src/frontend/use-user";
import {db} from "../firebase";
import {addDoc, collection, doc, getDocs, getDoc, query, setDoc, where, serverTimestamp, onSnapshot} from "firebase/firestore";
import {FirebaseProfile, FirebaseUser} from "../utils/types/firebase";


export const getOrCreateUserFromFirebase = async (user: UserProfile) => {
    try {
        // Check if the Auth0-Firebase mapping is available
        const checkIfUserExists = await getDocs(query(collection(db, "users"), where("auth0", "==", user.sub)));

        // Create user if it doesn't already exist
        if (!checkIfUserExists.docs.length) {
            // The mapping is not present:
            // This is the first time ever the user logs into the app.
            // Create a new user
            const newUser: FirebaseUser = {
                email: user?.email || '',
                lastSeen: serverTimestamp(),
                name: user?.name || '',
                provider: 'Auth0',
                auth0: user?.sub || '',
                blockedUsers: {}, // List of people blocked by the user
                posts: {}, // List of posts the user has made,
            }
            const newlyAddedUserRef = await addDoc(collection(db, "users"), newUser);

            // Create a new user profile using the same id as the
            // newly created user entry 
            const newProfile: FirebaseProfile = {
                bio: '',
                dm: false,
                lastName: '',
                location: '',
                resetProfile: true, // true since this is the default profile
                name: '',
                profilePic: user.picture || '',
                username: user.nickname || '',
                uid: newlyAddedUserRef.id // store the user's id in profile so accessible in global state
            }
            await setDoc(doc(db, "profiles", newlyAddedUserRef.id), newProfile);

            // Return the new profile
            return newProfile;
        }
        
        // User already exists, fetch profile and return it
        const profileId = checkIfUserExists.docs[0].id;
        const userProfileDocRef = doc(db, "profiles", profileId);
        const profileDocSnap = await getDoc(userProfileDocRef);
        return profileDocSnap.data();
    } catch (e) {
        console.log(e)
    }
}

export const getUserDoc = async (id: string) => {
    try {
        const userDocRef = doc(db, "users", id);
        return await getDoc(userDocRef);
    } catch (e) {
        console.log(e)
    }
}

export const getUserDocData = async (id: string) => {
    try {
        const userDocRef = doc(db, "users", id);
        const userDoc = await getDoc(userDocRef);
        return userDoc.data()
    } catch (e) {
        console.log(e)
    }
}

export const streamUserData = (id: string,
    snapshot: (snap: firebase.firestore.snapshot) => void, 
    error: (err: any) => void
    ) => {
        const userDocRef = doc(db, "users", id);
        return onSnapshot(userDocRef, snapshot, error)
}