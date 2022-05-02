import { handleAuth, handleCallback } from '@auth0/nextjs-auth0'
import { getAuth, signInWithCustomToken } from 'firebase/auth'
import { NextApiRequest, NextApiResponse } from 'next'
import { getOrCreateUserFromFirebase } from '../../../lib/userHelper'

const setFirebaseCustomToken = async (token: string) => {
    // Fetch the Firebase custom token from the Auth0 user
    let firebaseFcnURL =
        'https://us-central1-oogway-pilot.cloudfunctions.net/getFirebaseToken'
    if (process.env.NODE_ENV === 'development') {
        // For dev mode, replace the URL of the function with the dev function URL
        firebaseFcnURL =
            'https://us-central1-oogway-pilot.cloudfunctions.net/getDevFirebaseToken'
    }
    const response = await fetch(firebaseFcnURL, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
    return response.json()
}

const afterCallback = async (req: any, res: any, session: any, state: any) => {
    // Retrieve the Firebase custom token from the Auth0 user
    const firebaseResponse = await setFirebaseCustomToken(session.idToken)

    // Sign in to Firebase with the custom token
    const auth = getAuth()
    const userCredential = await signInWithCustomToken(
        auth,
        firebaseResponse.firebaseToken
    ).catch(error => {
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
    session.user.uid = userProfile?.uid

    // Update auth0 UserProfile image
    session.user.picture = userProfile?.profilePic

    // Return the session
    return session
}

export default handleAuth({
    // Auth0 callback:
    // Use this function for validating additional claims on the user's ID Token or adding removing items
    // from the session after login.
    // For more information, see https://auth0.github.io/nextjs-auth0/modules/handlers_callback.html#handlecallback
    async callback(req: NextApiRequest, res: NextApiResponse) {
        try {
            await handleCallback(req, res, {
                afterCallback,
            })
        } catch (err) {
            res.setHeader('location', '/')
            .status(302)
            .end();
        }
    },
})
