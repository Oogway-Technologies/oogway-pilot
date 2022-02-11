import {UserProfile} from "@auth0/nextjs-auth0/src/frontend/use-user";
import {db} from "../firebase";
import {addDoc, collection, doc, getDocs, getDoc, query, setDoc, where, serverTimestamp} from "firebase/firestore";
import {FirebaseProfile, FirebaseUser} from "../utils/types/firebase";

export const getOrCreateUserFromFirebase = async (user: UserProfile) => {
    try {
        // Check if the Auth0-Firebase mapping is available
        const checkIfUserExists = await getDocs(query(collection(db, "auth0"), where("auth0", "==", user.sub)));

        // Create user if it doesn't already exist
        if (!checkIfUserExists.docs.length) {
            // The mapping is not present:
            // This is the first time ever the user logs into the app.
            // Create Auth0 mapping for the new user
            const newAddedAuthRef = await addDoc(collection(db, 'auth0'), {
                auth0: user.sub,
            })

            // Use the referenced doc id to add a new user and user profile.
            // TODO: check if blockedUsers and posts are better as sub-collections.
            const newUser: FirebaseUser = {
                email: user?.email || '',
                lastSeen: serverTimestamp(),
                name: user?.name || '',
                provider: 'Auth0',
                auth0: user?.sub || '',
                blockedUsers: [], // List of people blocked by the user
                posts: [], // List of posts the user has made
            }
            await setDoc(doc(db, "users", newAddedAuthRef.id), newUser);

            // Create a new user profile
            const newProfile: FirebaseProfile = {
                bio: '',
                dm: false,
                lastName: '',
                location: '',
                resetProfile: true, // true since this is the default profile
                name: '',
                profilePic: user.picture || '',
                username: user.nickname || ''
            }
            await setDoc(doc(db, "profiles", newAddedAuthRef.id), newProfile);

            // Return the new profile
            return newProfile;
        }
        
        // Profile data exists, fetch and return it
        const profileId = checkIfUserExists.docs[0].id;
        const userProfileDocRef = doc(db, "profiles", profileId);
        const profileDocSnap = await getDoc(userProfileDocRef);
        return profileDocSnap.data();
    } catch (e) {
        console.log(e)
    }
}
