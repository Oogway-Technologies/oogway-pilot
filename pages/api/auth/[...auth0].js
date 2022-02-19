import { handleAuth, handleCallback } from '@auth0/nextjs-auth0'
import { getAuth, signInWithCustomToken } from 'firebase/auth'

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
        // TODO: block signing in?
        const errorMessage = error.message
        console.log('error:', errorMessage)
    })

    // Note: session.user already contains the Auth0 user
    // as Session.user.sub. This should be the same as
    // the userCredentials returned by Firebase, i.e.,
    // if (userCredential) {
    //    session.user.sub === userCredential.user.uid
    // }
    // TODO: check and/or assert the above condition?
    if (userCredential && session.user.sub !== userCredential.user.uid) {
        console.log(
            'Mismatch between Auth0 user and Firebase auth user. This could be serious.'
        )
    }

    // Return the session
    return session
}

export default handleAuth({
    async callback(req, res) {
        try {
            await handleCallback(req, res, { afterCallback })
        } catch (error) {
            res.status(error.status || 500).end(error.message)
        }
    },
})

// export default handleAuth()
