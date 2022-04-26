import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { NextApiRequest, NextApiResponse } from 'next'

import { db } from '../../firebase'
import { FirebaseDecisionActivity } from '../../utils/types/firebase'

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { body } = req

        // Create decision acitivty
        const decision: FirebaseDecisionActivity = {
            ...body,
            timestamp: serverTimestamp(),
        }
        const docRef = await addDoc(
            collection(db, 'decision-activity'),
            decision
        )

        // Return status
        if (!docRef) {
            return res
                .status(403)
                .json({ err: `Failed to log decision: ${decision}` })
        }
        return res.status(201).json(decision)
    } catch (err) {
        return res.status(403).json({ err: 'Error!' })
    }
}

export default async function decisionHandler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method } = req

    // Perform request
    if (method === 'POST') await handlePost(req, res)
    else {
        res.setHeader('Allow', ['POST'])
        res.status(405).end(`Method ${method} Not Allowed.`)
    }
}
