// Token imports
const functions = require('firebase-functions')
const admin = require('firebase-admin')
const jwt = require('jsonwebtoken')
const jwks = require('jwks-rsa')

// Firebase tools
const firebase_tools = require('firebase-tools')

const client = jwks({
    rateLimit: true,
    jwksUri: 'https://oogway-pilot.us.auth0.com/.well-known/jwks.json',
})

const devClient = jwks({
    rateLimit: true,
    jwksUri: 'https://dev-4b2tjbbr.us.auth0.com/.well-known/jwks.json',
})

const getKey = (header, callback) => {
    client.getSigningKey(header.kid, (err, key) => {
        const signingKey = key.publicKey || key.rsaPublicKey
        callback(null, signingKey)
    })
}

const getDevKey = (header, callback) => {
    devClient.getSigningKey(header.kid, (err, key) => {
        const signingKey = key.publicKey || key.rsaPublicKey
        callback(null, signingKey)
    })
}

const options = {
    audience: 'vmTXnQbeSY6JNdetz0F4DQrtvxl4QoRs',
    issuer: 'https://oogway-pilot.us.auth0.com/',
    algorithms: ['RS256'],
}

const devOptions = {
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

exports.getDevFirebaseToken = functions.https.onRequest(async (req, res) => {
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

    return jwt.verify(token, getDevKey, devOptions, async (error, decoded) => {
        if (error) return res.status(500).send(error)
        const uid = decoded.sub
        const firebaseToken = await admin.auth().createCustomToken(uid)
        return res.json({ firebaseToken })
    })
})

// [START recursive_delete_function]
/**
 * Initiate a recursive delete of documents at a given path.
 *
 * The calling user must be authenticated and have the custom "admin" attribute
 * set to true on the auth token.
 *
 * This delete is NOT an atomic operation and it's possible
 * that it may fail after only deleting some documents.
 *
 * @param {string} data.path the document or collection path to delete.
 */
exports.recursiveDelete = functions
    .runWith({
        timeoutSeconds: 540,
        memory: '2GB',
    })
    .https.onCall(async (data, context) => {
        const path = data.path
        console.log(`User has requested to delete path ${path}`)

        // Run a recursive delete on the given document or collection path.
        // The 'token' must be set in the functions config, and can be generated
        // at the command line by running 'firebase login:ci'.
        await firebase_tools.firestore.delete(path, {
            project: 'oogway-pilot',
            recursive: true,
            yes: true,
            token: functions.config().fb.token,
        })

        return {
            path: path,
        }
    })
// [END recursive_delete_function]
