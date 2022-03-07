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
            user: { uid },
        } = session ? session : { accessToken: '', user: { uid: '' } }
        // Call management API
        const baseURL =
            process.env.AUTH0_ISSUER_BASE_URL?.indexOf('http') === 0
                ? process.env.AUTH0_ISSUER_BASE_URL
                : `https://${process.env.AUTH0_ISSUER_BASE_URL}`
        const reqURL = baseURL + `api/v2/users/${uid}`
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
