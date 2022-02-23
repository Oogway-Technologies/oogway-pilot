import {doc, getDoc, onSnapshot} from "firebase/firestore"
import {db} from "../firebase"

/**
 *
 * @param id profile id
 * @description Retrieves a promise of the profile document from firebase
 */
export const getProfileDoc = async (id: string) => {
    const profileDocRef = doc(db, "profiles", id)
    return await getDoc(profileDocRef)
}

/**
 *
 * @param id profile id
 * @description Retrieves a promise of profile document data from firebase
 */
export const getProfileDocData = async (id: string) => {
    const profileDocRef = doc(db, "profiles", id)
    const profileDocSnap = await getDoc(profileDocRef)
    return profileDocSnap.data()
}

/**
 *
 * @param id post id
 * @param snapshot a side-effect function to be called using the returned snapshot
 * @param error a function specifying how to handle error retrieving the snapshot
 * @description streams the profile real time and performs the snapshot function on it.
 */
export const streamProfileData = (
    id: string,
    snapshot: (snap: any) => void,
    error: (err: any) => void
) => {
    const profileRef = doc(db, "profiles", id)
    return onSnapshot(profileRef, snapshot, error)
}
