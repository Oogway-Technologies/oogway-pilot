import { deleteDoc, doc, getDoc } from 'firebase/firestore'
import { NextApiRequest, NextApiResponse } from 'next'

import { db } from '../../../firebase'

async function handleGet(id: string, res: NextApiResponse) {
    try {
        const docRef = doc(db, 'decision-activity', id)
        const docSnapshot = await getDoc(docRef)
        if (docSnapshot.exists()) {
            return res.status(200).json(docSnapshot.data())
        }
        return res.status(404).end()
    } catch (err) {
        return res.status(403).json({ err: 'Bad request.' })
    }
}

async function handleDelete(id: string, res: NextApiResponse) {
    try {
        const docRef = doc(db, 'decision-activity', id)
        await deleteDoc(docRef).catch(err => {
            return res.status(403).json({ err: err })
        })
        return res.status(204).end()
    } catch (err) {
        return res.status(403).json({ err: 'Bad request.' })
    }
}

export default async function decisionActivityIdHandler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method, query } = req
    const { id } = query
    if (typeof id !== 'string') return res.status(403).end()

    // Perform request
    switch (method) {
        case 'GET':
            await handleGet(id, res)
            break
        case 'DELETE':
            await handleDelete(id, res)
            break
        default:
            res.setHeader('Allow', ['GET', 'DELETE'])
            res.status(405).end(`Method ${method} Not Allowed.`)
    }
}
