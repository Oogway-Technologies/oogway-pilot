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
    updateDoc,
    where,
} from 'firebase/firestore'

import { db } from '../firebase'
import { fetcher } from '../utils/helpers/common'
import {
    FirebaseProfile,
    FirebaseUser,
    userConverter,
} from '../utils/types/firebase'

export const getOrCreateUserFromFirebase = async (
    user: UserProfile,
    ipAddress: string | null | undefined
): Promise<any> => {
    try {
        // Check if the Auth0-Firebase mapping is available
        const checkIfUserExists = await getDocs(
            query(
                collection(db, 'users'),
                where('auth0', '==', user.sub)
            ).withConverter(userConverter)
        )
        const userAuth: { email: string } = await fetcher(
            `/api/registerEmail?userId=${user.sub}`
        )
        // Create user if it doesn't already exist
        if (!checkIfUserExists.docs.length) {
            // The mapping is not present:
            // This is the first time ever the user logs into the app.
            // Create a new user
            const newUser: FirebaseUser = {
                email: userAuth.email || '',
                lastSeen: serverTimestamp(),
                name: user?.name?.includes('@')
                    ? user?.name?.split('@')[0]
                    : user?.name || '',
                provider: 'Auth0',
                auth0: user?.sub || '',
                blockedUsers: {}, // List of people blocked by the user
                posts: {}, // List of posts the user has made,
                timestamp: serverTimestamp(),
                ipAddresses: ipAddress ? [ipAddress] : [],
            }
            // Create a new authenticated user in Firebase
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
                name: user?.name?.includes('@')
                    ? user?.name?.split('@')[0]
                    : user?.name || '',
                profilePic: user.picture || '',
                username: user.nickname || '',
                uid: newlyAddedUserRef.id, // store the user's id in profile so accessible in global state
                email: userAuth.email,
            }
            await setDoc(doc(db, 'profiles', newlyAddedUserRef.id), newProfile)

            // Return the new profile
            return newProfile
        } else {
            if (
                ipAddress &&
                ipAddress !== '127.0.0.1' &&
                ipAddress.includes('.')
            ) {
                const existingUser = checkIfUserExists.docs[0].data()
                if (!('ipAddress' in existingUser)) {
                    // If user exists and doesn't have ipAddress, add ipAddress to user object
                    await updateDoc(
                        doc(db, 'users', checkIfUserExists.docs[0].id),
                        { ipAddresses: [ipAddress] }
                    )
                } else {
                    // If user exists and tracked ip address is not in current user object
                    // add to list of ipAddresses
                    if (!existingUser.ipAddresses?.includes(ipAddress)) {
                        existingUser.ipAddresses?.push(ipAddress)
                        await setDoc(
                            doc(db, 'users', checkIfUserExists.docs[0].id),
                            existingUser,
                            { merge: true }
                        )
                    }
                }
            }
        }

        // User already exists, fetch profile and return it
        const profileId = checkIfUserExists.docs[0].id
        const userProfileDocRef = doc(db, 'profiles', profileId)
        const profileDocSnap = await getDoc(userProfileDocRef)
        return { email: userAuth.email, ...profileDocSnap.data() }
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
