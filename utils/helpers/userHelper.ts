import {UserProfile} from "@auth0/nextjs-auth0/src/frontend/use-user";
import {db} from "../../firebase";

export const getUserFromFirebase = async (user: UserProfile) => {
    try {
        //creates user if not created.
        db.collection("auth0").where('auth0', '==', user.sub).get().then((data) => {
            if (!data.docs.length) {
                // to create Auth0 of the new user.
                db.collection('auth0').doc().set({
                    auth0: user.sub,
                }).then(() => {
                    console.log('auth0 created')
                })
                // to create new user.
                db.collection('users').doc().set({
                    email: '',
                    expirationTime: '',
                    lastSeen: '',
                    name: user.name,
                    photoUrl: user.picture,
                    provider: "Auth0",
                    resetProfile: true,
                    uid: user.sub,
                }).then(() => {
                    console.log('user created')
                })
                // to create profile of the new user.
                db.collection('profiles').doc().set({
                    bio: "",
                    dm: false,
                    lastName: user.family_name,
                    location: "",
                    name: user.name,
                    profilePic: user.picture,
                    resetProfile: false,
                    uid: user.sub,
                    username: user.nickname
                }).then(() => {
                    console.log('profile created')
                })
            }
        })

        //get user
        const currentUserProfilePromise = db.collection("users").where('uid', '==', user.sub).get();
        return await currentUserProfilePromise.then((data) => {
            return data
        })
    } catch (e) {
        console.log(e)
    }
}
