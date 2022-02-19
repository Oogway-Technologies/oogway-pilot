import { getAccessToken } from '@auth0/nextjs-auth0'

const afterRefresh = (req, res, session) => {
    session.user.customProperty = 'foo'
    delete session.idToken
    return session
}

export default async function MyHandler(req, res) {
    const accessToken = await getAccessToken(req, res, {
        refresh: true,
        afterRefresh,
    })
    console.log(accessToken)
}
