import {
    addDoc,
    collection,
    doc,
    serverTimestamp,
    setDoc,
} from 'firebase/firestore'
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

        // Check if decision activity already exists
        // If so, update
        if (decision.id) {
            const updateDocRef = doc(db, 'decision-activity', decision.id)
            await setDoc(updateDocRef, decision, { merge: true })
            return res.status(200).json({ ...decision })
        }

        // otherwise create a new one.
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
        return res.status(201).json({ id: docRef.id, ...decision })
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
