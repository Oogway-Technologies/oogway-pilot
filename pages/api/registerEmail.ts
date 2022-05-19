import { ManagementClient } from 'auth0'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handleGet(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const userId = req?.query?.userId || ''
    console.log('UserId query param: ', userId) // remove
    if (!userId) {
        return res.status(400).json({
            error: 'no user id in query params',
        })
    }
    const management = new ManagementClient({
        domain: process.env.AUTH0_ISSUER_RAW_BASE_URL || '',
        clientId: process.env.AUTH0_CLIENT_ID,
        clientSecret: process.env.AUTH0_CLIENT_SECRET,
        scope: 'read:users update:users',
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
