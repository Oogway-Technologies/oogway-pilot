import {db} from "../firebase";
import firebase from 'firebase/compat/app';

export async function createUser(uid, data) {
    console.log("Creating")
    console.log(uid);
    console.log(data);

    return await db
      .collection('users')
      .doc(uid)
      .set({
        uid,
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        ...data
    },
    // Need to use merge since set replaces everything BUT
    // with merge we just update (or create new) content
    { merge: true });
}
