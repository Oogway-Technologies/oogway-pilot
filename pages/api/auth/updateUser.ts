import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
import { NextApiRequest, NextApiResponse } from 'next'
import axios from '../../../axios'

export default withApiAuthRequired(async function updateUser(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        if (req.method !== 'PATCH') {
            res.setHeader('Allow', ['PATCH'])
            res.status(405).send({ message: 'Only PATCH requests allowed' })
            return
        }
        // Fetch request body
        const body = { user_metadata: req.body }
        // Fetch user token
        const session = getSession(req, res)
        const {
            accessToken,
            user: { sub },
        } = session ? session : { accessToken: '', user: { sub: '' } }
        // Call management API
        const baseURL =
            process.env.AUTH0_ISSUER_BASE_URL?.indexOf('http') === 0
                ? process.env.AUTH0_ISSUER_BASE_URL.replace('https', 'http')
                : process.env.AUTH0_ISSUER_BASE_URL
        const reqURL = baseURL + `api/v2/users/${sub.replace('auth0|', '')}`
        const options = {
            headers: {
                authorization: `Bearer ${accessToken}`,
                'content-type': 'application/json',
            },
        }
        const response = await axios.patch(reqURL, body, options)

        // Return
        res.status(response.status || 200).json(response.data)
    } catch (error: any) {
        console.log(error)
        res.status(error.status || 500).json({
            code: error.code,
            error: error.message,
        })
    }
})
