import { handleAuth, handleCallback } from '@auth0/nextjs-auth0'
import { getOrCreateUserFromFirebase } from '../../../lib/userHelper'

const afterCallback = async (req, res, session, state) => {
    // Get (or create) user and profile in firebase on login
    // prior to redirecting to page
    const userProfile = await getOrCreateUserFromFirebase(session.user)

    // Append firebase uid to auth0 UserProfile
    session.user.uid = userProfile.uid

    // Comment this on off and look at user dropdown upon login to see
    // that these changes carry over into sesssion...
    session.user.picture = userProfile.profilePic

    // Compare
    console.log('userProfile returned from firebase: ', userProfile)
    console.log('Modified session user: ', session.user)

    return session
}

export default handleAuth({
    async callback(req, res) {
        try {
            await handleCallback(req, res, { afterCallback })
        } catch (err) {
            res.status(err.status || 500).end(err.message)
        }
    },
})
