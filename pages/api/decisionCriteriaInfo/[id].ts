/**
 * Endpoint to CRUD specific decisionCriteriaInfo
 */
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { NextApiRequest, NextApiResponse } from 'next'

import { db } from '../../../firebase'
import { FirebaseDecisionCriteriaInfo } from '../../../utils/types/firebase'

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query

        // Fetch single document
        const docRef = doc(db, 'decisionCriteriaInfo', id as string)
        const docSnapshot = await getDoc(docRef)

        if (docSnapshot.exists()) {
            const payload = {
                id: docSnapshot.id,
                ...docSnapshot.data(),
            }
            // Return document
            return res.status(200).json(payload as FirebaseDecisionCriteriaInfo)
        }
        return res.status(200).json({ err: 'No results found.' })
    } catch (err) {
        return res.status(403).json({ err: 'Error!' })
    }
}

interface ExtendedNextApiRequest extends NextApiRequest {
    body: FirebaseDecisionCriteriaInfo
}

async function handlePut(req: ExtendedNextApiRequest, res: NextApiResponse) {
    // Get or create new decisionCriteriaInfo
    try {
        const {
            query: { id },
            body,
        } = req

        // Update body with timestamp
        const payload = {
            ...body,
            timestamp: serverTimestamp(),
        }

        const docRef = doc(db, 'decisionCriteriaInfo', id as string)
        const docSnap = await getDoc(docRef)
        // Overwrite or create resourcce
        await setDoc(docRef, payload as FirebaseDecisionCriteriaInfo)

        // Return HTTP code conditional on original resource status
        if (docSnap.exists()) {
            return res.status(200).end()
        } else {
            return res.status(201).end()
        }
    } catch (err) {
        return res.status(403).json({ err: 'Error!' })
    }
}

export default async function decisionCriteriaInfoIdHandler(
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
