import {handleAuth, handleCallback} from '@auth0/nextjs-auth0'
import {getAuth, signInWithCustomToken} from 'firebase/auth'
import {getOrCreateUserFromFirebase} from '../../../lib/userHelper'

const setFirebaseCustomToken = async (token) => {
    // Fetchm the Firebase custom token from the Auth0 user
    const response = await fetch(
        'https://us-central1-oogway-pilot.cloudfunctions.net/getFirebaseToken',
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )
    return response.json()
}

const afterCallback = async (req, res, session, state) => {
    // Retrieve the Firebase custom token from the Auth0 user
    const firebaseResponse = await setFirebaseCustomToken(session.idToken)

    // Sign in to Firebase with the custom token
    const auth = getAuth()
    const userCredential = await signInWithCustomToken(
        auth,
        firebaseResponse.firebaseToken
    ).catch((error) => {
        // Something went wrong trying to authenticate with Firebase
        const errorMessage = error.message
        console.log('error:', errorMessage)

        // Redirect to the login page, i.e., logout the user
        state.returnTo = '/api/auth/logout'

        // Return the session as-is
        return session
    })

    if (userCredential && session.user.sub !== userCredential.user.uid) {
        // Something's fishy here...log out the user
        console.log(
            'Mismatch between Auth0 user and Firebase auth user. This could be serious.'
        )

        state.returnTo = '/api/auth/logout'

        // Return the session as-is
        return session
    }

    // Everything is good, get (or create) user and profile in firebase on login
    // prior to redirecting to page
    const userProfile = await getOrCreateUserFromFirebase(session.user)

    // Append firebase uid to auth0 UserProfile
    session.user.uid = userProfile.uid

    // Note: session.user already contains the Auth0 user
    // as Session.user.sub. This should be the same as
    // the userCredentials returned by Firebase, i.e.,
    // if (userCredential) {
    //    session.user.sub === userCredential.user.uid
    // }

    // Return the session
    return session
}

export default handleAuth({
    // Auth0 callback:
    // Use this function for validating additional claims on the user's ID Token or adding removing items
    // from the session after login.
    // For more information, see https://auth0.github.io/nextjs-auth0/modules/handlers_callback.html#handlecallback
    async callback(req, res) {
        try {
            await handleCallback(req, res, {
                afterCallback,
            })
        } catch (error) {
            res.status(error.status || 500).end(error.message)
        }
    },
})
