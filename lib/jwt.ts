import jwt, { Jwt, JwtPayload } from 'jsonwebtoken'
import { NextApiRequest } from 'next'

declare module 'jsonwebtoken' {
    export interface JwtPayload {
        botId: string
    }
}

// Read in secret key
export const JWT_SECRET_KEY: string = process.env.JWT_SECRET as string

// jwt sign wrapper
export const signJwt = (
    payload: string | object | Buffer,
    options?: jwt.SignOptions | undefined
) => {
    // sign and encode payload using HS256 (symmetric)
    if (options?.algorithm && options?.algorithm !== 'HS256')
        throw new Error('Algorithm must be HS256')
    return jwt.sign(payload, JWT_SECRET_KEY, options)
}

// jwt verify wrapper
export const verifyJwt = async (
    token: string,
    callback: (
        err: jwt.VerifyErrors | null,
        decoded: string | JwtPayload | Jwt | undefined
    ) => void,
    options?: jwt.VerifyOptions & { complete: true }
) => {
    if (options?.algorithms && !options?.algorithms?.includes('HS256'))
        throw new Error('Algorithms must include HS256')
    return jwt.verify(token, JWT_SECRET_KEY, options, callback)
}

// Check request heders for authorization
export const checkReq = (req: NextApiRequest) => {
    const headerErr = ['must specify an Authorization header', null]
    const formatErr = ["format is 'Authorization: Bearer <token>'", null]
    if (!req) return 'server error (request was invalid)'
    const { headers } = req
    if (!headers) return headerErr
    const { authorization } = headers
    if (!authorization) return headerErr
    const parts = authorization.split(' ')
    if (parts.length != 2) return formatErr
    const [scheme, credentials] = parts
    if (!/^Bearer$/i.test(scheme)) return formatErr
    return [false, credentials] as const
}
