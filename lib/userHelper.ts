import { UserProfile } from '@auth0/nextjs-auth0/src/frontend/use-user'
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    query,
    serverTimestamp,
    setDoc,
    where,
} from 'firebase/firestore'

import { db } from '../services/firebase'
import { FirebaseProfile, FirebaseUser } from '../utils/types/firebase'

export const getOrCreateUserFromFirebase = async (
    user: UserProfile
): Promise<any> => {
    try {
        // Check if the Auth0-Firebase mapping is available
        // TODO: Check if the user is in the database and/or is defined
        const checkIfUserExists = await getDocs(
            query(collection(db, 'users'), where('auth0', '==', user.sub))
        )

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
            const newlyAddedUserRef = await addDoc(
                collection(db, 'users'),
                newUser
            )

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
                uid: newlyAddedUserRef.id, // store the user's id in profile so accessible in global state
            }
            await setDoc(doc(db, 'profiles', newlyAddedUserRef.id), newProfile)

            // Create a new authenticated user in Firebase

            // Return the new profile
            return newProfile
        }

        // User already exists, fetch profile and return it
        const profileId = checkIfUserExists.docs[0].id
        const userProfileDocRef = doc(db, 'profiles', profileId)
        const profileDocSnap = await getDoc(userProfileDocRef)
        return profileDocSnap.data()
    } catch (e) {
        console.log(e)
    }
}

export const getUserDoc = async (id: string): Promise<any> => {
    if (!id) {
        return null
    }

    try {
        const userDocRef = doc(db, 'users', id)
        return await getDoc(userDocRef)
    } catch (e) {
        console.log(e)
    }
}

export const getUserDocData = async (id: string) => {
    try {
        await getUserDoc(id).then(doc => {
            if (doc) {
                return doc.data()
            } else {
                return null
            }
        })
    } catch (e) {
        console.log(e)
    }
}

export const streamUserData = (
    id: string,
    snapshot: (snap: any) => void,
    error: (err: any) => void
) => {
    const userDocRef = doc(db, 'users', id)
    return onSnapshot(userDocRef, snapshot, error)
}
