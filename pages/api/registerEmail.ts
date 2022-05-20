import { getSession } from '@auth0/nextjs-auth0'
import { ManagementClient } from 'auth0'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handleGet(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const userId = req?.query?.userId || ''
    if (!userId) {
        return res.status(400).json({
            error: 'no user id in query params',
        })
    }
    const session = await getSession(req, res)
    const accessToken = session?.accessToken
    console.log('Access token: ', accessToken) // remove
    const management = new ManagementClient({
        token: accessToken,
        domain: process.env.AUTH0_ISSUER_RAW_BASE_URL || '',
        // clientId: process.env.AUTH0_CLIENT_ID,
        // clientSecret: process.env.AUTH0_CLIENT_SECRET,
        scope: 'openid read:users update:users',
    })

    management.getUser({ id: userId as string }, function (error: Error, user) {
        if (error) {
            console.log('Error: ', error)
            res.status(400).json({
                error: 'error while fetching user email from Auth0',
            })
            return
        }

        res.status(200).json({ email: user.email })
    })
}
