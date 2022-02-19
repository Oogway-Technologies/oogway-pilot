import { handleAuth, handleCallback, getAccessToken } from '@auth0/nextjs-auth0'

const setFirebaseCustomToken = async (token) => {
    const response = await fetch(
        'https://us-central1-oogway-pilot.cloudfunctions.net/getFirebaseToken',
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )
}

const afterCallback = async (req, res, session, state) => {
    console.log('after callback!')
    const accessToken = await getAccessToken(req, res)
    console.log('after token!', accessToken)
    //const firebaseResponse = await setFirebaseCustomToken(accessToken)
    //console.log('firebaseResponse:', firebaseResponse)
    // delete session.refreshToken

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
