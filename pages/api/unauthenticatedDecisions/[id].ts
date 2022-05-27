/**
 * Endpoint to CRUD specific unauthenticatedDecision document
 */
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { NextApiRequest, NextApiResponse } from 'next'

import { db } from '../../../firebase'
import { FirebaseUnauthenticatedDecision } from '../../../utils/types/firebase'

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query

        // Fetch single document
        const docRef = doc(db, 'unauthenticated-decisions', id as string)
        const docSnapshot = await getDoc(docRef)

        if (docSnapshot.exists()) {
            return res
                .status(200)
                .json({ results: docSnapshot.data(), err: null })
        }
        return res.status(200).json({ results: null, err: 'No results found.' })
    } catch (err) {
        return res.status(403).json({ err: 'Error!' })
    }
}

interface ExtendedNextApiRequest extends NextApiRequest {
    body: FirebaseUnauthenticatedDecision
}

async function handlePut(req: ExtendedNextApiRequest, res: NextApiResponse) {
    const {
        query: { id },
        body,
    } = req

    try {
        const docRef = doc(db, 'unauthenticated-decisions', id as string)
        const docSnap = await getDoc(docRef)
        // Return HTTP code conditional on original resource status
        if (docSnap.exists()) {
            // Update body with timestamp
            const payload: FirebaseUnauthenticatedDecision = {
                ...body,
                updatedAt: serverTimestamp(),
            }
            await setDoc(docRef, payload, { merge: true })
            return res.status(200).end()
        } else {
            const payload: FirebaseUnauthenticatedDecision = {
                ...body,
                updatedAt: serverTimestamp(),
                createdAt: serverTimestamp(),
            }
            await setDoc(docRef, payload)
            return res.status(201).end()
        }
    } catch (err) {
        return res.status(403).json({ err: 'Error!' })
    }
}

export default async function unauthenticatedDecisionsIdHandler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method } = req

    // Perform request
    switch (method) {
        case 'GET':
            await handleGet(req, res)
            break
        case 'PUT':
            await handlePut(req, res)
            break
        default:
            res.setHeader('Allow', ['GET', 'PUT'])
            res.status(405).end(`Method ${method} Not Allowed.`)
    }
}
