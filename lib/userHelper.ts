import {UserProfile} from "@auth0/nextjs-auth0/src/frontend/use-user";
import {db} from "../firebase";
import {addDoc, collection, doc, getDocs, query, setDoc, where} from "firebase/firestore";
import {FirebaseProfile, FirebaseUser} from "../utils/types/firebase";

export const getUserFromFirebase = async (user: UserProfile) => {
    try {
        const checkIfUserExists = await getDocs(query(collection(db, "auth0"), where("auth0", "==", user.sub)));

        //creates user if not created.
        if (!checkIfUserExists.docs.length) {
            // to create Auth0 of the new user.
            const newAddedAuthRef = await addDoc(collection(db, 'auth0'), {
                auth0: user.sub,
            })
            // to create new user.
            const newUser: FirebaseUser = {
                email: user?.email || '',
                expirationTime: '',
                lastSeen: '',
                name: user?.name || '',
                photoUrl: user?.picture || '',
                provider: "Auth0",
                resetProfile: true,
                uid: user?.sub || '',
            }
            await setDoc(doc(db, "users", newAddedAuthRef.id), newUser);
            // to create profile of the new user.
            const newProfile: FirebaseProfile = {
                bio: "",
                dm: false,
                lastName: user?.family_name as string || '',
                location: "",
                name: user.name || '',
                profilePic: user.picture || '',
                resetProfile: false,
                uid: user.sub || '',
                username: user.nickname || ''
            }
            await setDoc(doc(db, "profiles", newAddedAuthRef.id), newProfile);
        }
        const getUserProfileData = await getDocs(query(collection(db, "users"), where("uid", "==", user.sub)));
        return getUserProfileData.docs[0].data()
    } catch (e) {
        console.log(e)
    }
}
