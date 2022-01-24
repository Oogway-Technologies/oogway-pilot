import { db } from "../firebase";
import firebase from "firebase/compat/app";

export async function createUser(uid, data) {
  return await db
    .collection("users")
    .doc(uid)
    .set(
      {
        uid,
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        ...data,
      },
      // Need to use merge since set replaces everything BUT
      // with merge we just update (or create new) content
      { merge: true }
    );
}

export async function createUserProfile(uid, data) {
  let docRef = db.collection("profiles").doc(uid);
  docRef.get().then((doc) => {
    if (!doc.exists) {
      // Only set if the doc does not exist
      db.collection("profiles")
        .doc(uid)
        .set(
          {
            uid,
            ...data,
          },
          // Need to use merge since set replaces everything BUT
          // with merge we just update (or create new) content
          { merge: true }
        );
    }
  });
}
