import { JwtPayload } from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'

import { checkReq, verifyJwt } from '../../lib/jwt/jwt'
import decryptAES from '../../utils/helpers/decryptAES'

/**
 * In order to protect against unauthorized users calling this endpoint,
 * it is protected by a token.
 *
 * When sending POST requests to endpoint, you must create a token using signJwt
 * that encrypts the SERVICE_DECRYPTION KEY and pass it in as an authorization header:
 *
 * const token = signJwt({ decryptionKey: process.env.SERVICE_DECRYPTION_KEY })
 * const headers = { authorization: `Bearer ${token}` }
 */

export default (req: NextApiRequest, res: NextApiResponse) => {
    // Check authentication
    const [message, token] = checkReq(req)
    if (message) return res.status(500).json({ message })

    // verify token
    if (token) {
        verifyJwt(token, (err, decoded) => {
            // Error encountered, e.g. tampered with token
            if (err) return res.status(401).send(err)

            // Fetch key
            const { decryptionKey } = <JwtPayload>decoded
            // Invalid key
            if (
                decryptionKey !== (process.env.SERVICE_DECRYPTION_KEY as string)
            )
                return res
                    .status(401)
                    .send('Client unauthorized to make this call.')
        })
    } else {
        // No token provided
        return res
            .status(401)
            .json({ err: 'Client unauthorized to make this call.' })
    }

    try {
        const decryptedData = decryptAES(req.body.data)
        return res.status(200).json(decryptedData)
    } catch (err) {
        return res.status(403).json({ err: err })
    }
}
