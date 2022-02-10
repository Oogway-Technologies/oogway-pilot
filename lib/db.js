import { db } from '../firebase'
import firebase from 'firebase/compat/app'

export async function createUser(uid, data) {
    let docRef = db.collection('users').doc(uid)
    return await docRef.set(
        {
            uid,
            lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
            ...data,
        },
        // Need to use merge since set replaces everything BUT
        // with merge we just update (or create new) content
        { merge: true }
    )
}

export async function createUserProfile(uid, data) {
    let docRef = db.collection('profiles').doc(uid)
    return await docRef.set(
        {
            uid,
            ...data,
        },
        // Need to use merge since set replaces everything BUT
        // with merge we just update (or create new) content
        { merge: true }
    )
}
