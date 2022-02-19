const functions = require('firebase-functions')
const admin = require('firebase-admin')
const jwt = require('jsonwebtoken')
const jwks = require('jwks-rsa')

const client = jwks({
    rateLimit: true,
    jwksUri: 'https://dev-4b2tjbbr.us.auth0.com/.well-known/jwks.json',
})

const getKey = (header, callback) => {
    client.getSigningKey(header.kid, (err, key) => {
        const signingKey = key.publicKey || key.rsaPublicKey
        callback(null, signingKey)
    })
}

const options = {
    audience: 'ouEYU4SVxoa8JFrTwQ84VV90YnKlfdqc',
    issuer: 'https://dev-4b2tjbbr.us.auth0.com/',
    algorithms: ['RS256'],
}

const checkReq = (req) => {
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
    return [false, credentials]
}

const serviceAccount = require('./firebase-key')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
})

exports.getFirebaseToken = functions.https.onRequest(async (req, res) => {
    // jwtCheck(req, res, afterJwtCheck)

    res.set('Access-Control-Allow-Origin', '*')

    if (req.method === 'OPTIONS') {
        res.set('Access-Control-Allow-Methods', 'GET')
        res.set('Access-Control-Allow-Headers', 'Authorization')
        res.set('Access-Control-Max-Age', '3600')
        return res.status(204).send('')
    }

    const [message, token] = checkReq(req)
    if (message) return res.status(500).send({ message })

    return jwt.verify(token, getKey, options, async (error, decoded) => {
        if (error) return res.status(500).send(error)
        const uid = decoded.sub
        const firebaseToken = await admin.auth().createCustomToken(uid)
        return res.json({ firebaseToken })
    })
})
