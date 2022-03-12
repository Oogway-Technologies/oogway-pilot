import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
import { ManagementClient, User } from 'auth0'
import { NextApiRequest, NextApiResponse } from 'next'

export default withApiAuthRequired(async function updateUser(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'PATCH') {
        res.setHeader('Allow', ['PATCH'])
        res.status(405).send({ message: 'Only PATCH requests allowed' })
        return
    }
    const management = new ManagementClient({
        domain: process.env.AUTH0_ISSUER_RAW_BASE_URL || '',
        clientId: process.env.AUTH0_CLIENT_ID,
        clientSecret: process.env.AUTH0_CLIENT_SECRET,
        scope: 'read:users update:users',
    })
    const session = getSession(req, res)
    const {
        user: { sub },
    } = session ? session : { user: { sub: '' } }

    management.updateUser(
        { id: sub },
        req.body,
        function (error: Error, user: User) {
            if (error) {
                console.log(error)
                res.status(500).json({
                    ...error,
                })
                return
            }
            res.status(200).send(user)
            return
        }
    )
})
