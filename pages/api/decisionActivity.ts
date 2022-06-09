import {
    addDoc,
    collection,
    doc,
    getDocs,
    limit,
    orderBy,
    OrderByDirection,
    query,
    serverTimestamp,
    setDoc,
    startAfter,
    where,
} from 'firebase/firestore'
import { NextApiRequest, NextApiResponse } from 'next'

import { db } from '../../firebase'
import { FirebaseDecisionActivity } from '../../utils/types/firebase'
import { APITimeStamp } from '../../utils/types/global'

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
    try {
        let {
            query: { _index, _order, _after, _size, _userId, _isComplete },
        } = req

        // Check query params and set defaults
        _index = _index ? (_index as string) : 'timestamp'
        if (!(_index === 'timestamp')) {
            res.status(400).end(
                `_index ${_index} Not Allowed. Must be 'timestamp'.`
            )
        }

        _order = _order ? (_order as string) : 'asc'
        if (!(_order === 'asc' || _order === 'desc')) {
            res.status(400).end(
                `_order ${_order} Not Allowed. Must be either 'asc' or 'desc'.`
            )
        }

        let afterTimestamp = new Date()
        if (_after && _after.length > 0) {
            // If _after is provided ensure it can be parsed into an int
            if (!parseInt(_after as string)) {
                res.status(400).end(
                    `_after ${_after} Not Allowed. Must be a parseable integer to convert to timestamp, e.g 1645079590.`
                )
            }

            // _After has been provided and can be parsed into
            // an int assume it has been supplied as a timestamp
            // in seconds (per the explanation) and convert it
            // to a timestamp.
            // Why must we convert to a Date? Firebase requires thte supplied value
            // to be a javascript Date object otherwise the query constraint fails
            afterTimestamp = new Date(parseInt(_after as string) * 1000)
        }

        let limitSize = 25
        if (_size && _size.length > 0) {
            // If _size is provided ensure it can be parsed into an int
            if (!parseInt(_size as string)) {
                res.status(400).end(
                    `_size ${_size} Not Allowed. Must be a parseable integer.`
                )
            }

            // If _size exceeds 100, cap at 100
            limitSize =
                parseInt(_size as string) > 100
                    ? 100
                    : parseInt(_size as string)
        }

        const userId = _userId ? (_userId as string) : undefined
        if (!userId) res.status(400).end(`Must provide a _userId.`)

        // Get optional filter params
        const isComplete = _isComplete ? (_isComplete as string) : undefined
        if (isComplete) {
            if (!(isComplete === 'true' || isComplete == 'false')) {
                res.status(400).end(
                    `_isComplete ${isComplete} Not Allowed. Must be either 'true' or 'false'.`
                )
            }
        }

        // Create query constraints
        const constraints = [
            orderBy(_index, <OrderByDirection>_order),
            startAfter(afterTimestamp),
            limit(limitSize),
            where('userId', '==', userId),
        ]
        if (isComplete) {
            const isCompleteBoolean = isComplete === 'true'
            constraints.push(where('isComplete', '==', isCompleteBoolean))
        }

        // Get engaagement activity from firebasse
        const q = query(collection(db, 'decision-activity'), ...constraints)
        const decisionActivitySnapshot = await getDocs(q)
        const decisions = decisionActivitySnapshot.docs.map(decision => ({
            id: decision.id,
            ...decision.data(),
        }))

        // Return payload
        const lastTime = decisions[decisions.length - 1] as APITimeStamp
        const firstTime = decisions[0] as APITimeStamp
        const payload = {
            decisions: decisions,
            lastTimestamp: lastTime?.timestamp || {
                seconds: 0,
                nanoseconds: 0,
            },
            firstTimestamp: firstTime?.timestamp || {
                seconds: 0,
                nanoseconds: 0,
            },
            hasNextPage: decisions.length === limitSize, // If full limit reached there may be another page, edge case is modulo 0
        }
        res.status(200).json(payload)
    } catch (err) {
        return res.status(403).json({ err: 'Error!' })
    }
}

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
            if (!updateDocRef) {
                return res.status(403).json({
                    err: `Failed to update decision: ${decision}`,
                })
            }
            await setDoc(updateDocRef, decision, { merge: true })
            return res.status(200).json({ ...decision })
        } else {
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
        }
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
    switch (method) {
        case 'GET':
            await handleGet(req, res)
            break
        case 'POST':
            await handlePost(req, res)
            break
        default:
            res.setHeader('Allow', ['GET', 'POST'])
            res.status(405).end(`Method ${method} Not Allowed.`)
    }
}
