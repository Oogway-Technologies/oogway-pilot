import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    limit,
    orderBy,
    OrderByDirection,
    query,
    serverTimestamp,
    setDoc,
    startAfter,
    updateDoc,
    where,
} from 'firebase/firestore'
import { NextApiRequest, NextApiResponse } from 'next'

import { db } from '../../services/firebase'
import { FirebaseEngagement } from '../../utils/types/firebase'
import { APITimeStamp } from '../../utils/types/global'

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
    try {
        let {
            query: { _index, _order, _after, _size, _engageeId, _isNew },
        } = req

        // Check query params and set defaults
        _index = _index ? (_index as string) : 'label'
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

        // Get optional filter params
        const engageeId = _engageeId ? (_engageeId as string) : undefined
        const isNew = _isNew ? (_isNew as string) : undefined
        if (isNew) {
            if (!(isNew === 'true' || isNew == 'false')) {
                res.status(400).end(
                    `_isNew ${isNew} Not Allowed. Must be either 'true' or 'false'.`
                )
            }
        }

        // Create query constraints
        const constraints = [
            orderBy(_index, <OrderByDirection>_order),
            startAfter(afterTimestamp),
            limit(limitSize),
        ]
        if (engageeId) {
            constraints.push(where('engageeId', '==', engageeId))
        }
        if (isNew) {
            const isNewBoolean = isNew === 'true'
            constraints.push(where('isNew', '==', isNewBoolean))
        }

        // Get engaagement activity from firebasse
        const q = query(collection(db, 'engagement-activity'), ...constraints)
        const engagementActivitySnapshot = await getDocs(q)
        const engagements = engagementActivitySnapshot.docs.map(engagement => ({
            id: engagement.id,
            ...engagement.data(),
        }))

        // Return payload
        const lastTime = engagements[engagements.length - 1] as APITimeStamp
        const firstTime = engagements[0] as APITimeStamp
        const payload = {
            engagements: engagements,
            lastTimestamp: lastTime?.timestamp || {
                seconds: 0,
                nanoseconds: 0,
            },
            firstTimestamp: firstTime?.timestamp || {
                seconds: 0,
                nanoseconds: 0,
            },
            hasNextPage: engagements.length === limitSize, // If full limit reached there may be another page, edge case is modulo 0
        }
        res.status(200).json(payload)
    } catch (err) {
        return res.status(403).json({ err: 'Error!' })
    }
}

interface ExtendedNextApiRequest extends NextApiRequest {
    body: FirebaseEngagement
}

async function handlePost(req: ExtendedNextApiRequest, res: NextApiResponse) {
    try {
        const { body } = req

        // Create engagement notification
        const engagement: FirebaseEngagement = {
            ...body,
            timestamp: serverTimestamp(),
        }
        if (engagement.action === 'vote' || engagement.action === 'like') {
            // Check if the engager already voted / liked the target. If so,
            // fetch that document and update the notificaation
            const q = query(
                collection(db, 'engagement-activity'),
                where('engagerId', '==', engagement.engagerId),
                where('targetRoute', '==', engagement.targetRoute),
                where('targetId', '==', engagement.targetId),
                where('action', '==', engagement.action)
            )
            const engagementSnapshot = await getDocs(q)
            const engagementIds = engagementSnapshot.docs.map(doc => doc.id)
            if (engagementIds.length > 0) {
                const engagementDocRef = doc(
                    db,
                    'engagement-activity',
                    engagementIds[0]
                )
                // Update votes and delete likes
                if (engagement.action === 'vote') {
                    await setDoc(engagementDocRef, engagement, { merge: true })
                    return res.status(201).json(engagement)
                } else {
                    await deleteDoc(engagementDocRef).catch(err => {
                        console.log('Cannot delete engagemment item: ', err)
                    })
                    return res
                        .status(201)
                        .json({ message: 'Like notification removed.' })
                }
            }
        }

        // For all other cases, add a new document
        await addDoc(collection(db, 'engagement-activity'), engagement)
        return res.status(201).json(engagement)
    } catch (err) {
        return res.status(403).json({ err: 'Error!' })
    }
}

async function handlePatch(req: NextApiRequest, res: NextApiResponse) {
    // try {
    // Fetch request body and parameters
    const {
        query: { _id },
        body,
    } = req

    // Check to ensure _id is include
    if (!_id)
        return res
            .status(400)
            .end(
                'Query parmamter _id is missing. Must be included to update resource.'
            )

    // Update engagement document
    const engagementDocRef = doc(db, 'engagement-activity', _id as string)
    let docSnap = await getDoc(engagementDocRef)
    if (docSnap.exists()) {
        // Update document if it existss
        await updateDoc(engagementDocRef, body)

        // Get updated document
        // Unfortunately, this second read call is necessary
        // if we want to returned the updated resource in
        // the API response
        docSnap = await getDoc(engagementDocRef)
        return res.status(201).json(docSnap.data())
    }

    // If document not found, return warning
    return res.status(400).end(`No document exists at the specified id: ${_id}`)
    // } catch (err) {
    //     return res.status(403).json({ err: 'Error!' })
    // }
}

export default async function engagementHandler(
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
        case 'PATCH':
            await handlePatch(req, res)
            break
        default:
            res.setHeader('Allow', ['GET', 'POST', 'PATCH'])
            res.status(405).end(`Method ${method} Not Allowed.`)
    }
}
