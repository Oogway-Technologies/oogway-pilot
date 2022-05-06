import {
    collection,
    getDocs,
    limit,
    orderBy,
    OrderByDirection,
    query,
    startAfter,
} from 'firebase/firestore'
import { NextApiRequest, NextApiResponse } from 'next'

import { db } from '../../../firebase'
import { APITimeStamp } from '../../../utils/types/global'

async function handleGet(
    res: NextApiResponse,
    _index: string,
    _order: string,
    afterTimestamp: Date,
    limitSize: number
) {
    try {
        // Create query constraints
        const constraints = [
            orderBy(_index, <OrderByDirection>_order),
            startAfter(afterTimestamp),
            limit(limitSize),
        ]

        // Get decisionCriteria from firebase
        const q = query(collection(db, 'decisionCriteriaaInfo'), ...constraints)
        const decisionCriteriaInfoSnapshot = await getDocs(q)
        const decisionCriteriaInfo = decisionCriteriaInfoSnapshot.docs.map(
            item => ({
                id: item.id,
                ...item.data(),
            })
        )

        // Check to ensure decisionCriteria found
        if (decisionCriteriaInfo.length === 0) {
            res.status(200).end(
                'No Results Found. Please check the query parameters.'
            )
        }

        const lastTime = decisionCriteriaInfo[
            decisionCriteriaInfo.length - 1
        ] as APITimeStamp
        const firstTime = decisionCriteriaInfo[0] as APITimeStamp
        // Return payload
        const payload = {
            decisionCriteriaInfo: decisionCriteriaInfo,
            lastTimestamp: lastTime?.timestamp || {
                seconds: 0,
                nanoseconds: 0,
            },
            firstTimestamp: firstTime?.timestamp || {
                seconds: 0,
                nanoseconds: 0,
            },
            hasNextPage: decisionCriteriaInfo.length === limitSize, // If full limit reached there may be another page, edge case is modulo 0
        }
        res.status(200).json(payload)
    } catch (err) {
        res.status(403).json({ err: 'Error!' })
    }
}

export default async function decisionCriteriaInfoHandler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    let {
        query: { _index, _order, _after, _size },
        method,
    } = req

    // Check query params and set defaults
    _index = _index ? (_index as string) : 'timestamp'
    if (!(_index === 'timestamp')) {
        res.status(400).end(
            `_index ${_index} Not Allowed. Must be 'timestamp'.`
        )
    }

    _order = _order ? (_order as string) : 'desc'
    if (!(_order === 'asc' || _order === 'desc')) {
        res.status(400).end(
            `_order ${_order} Not Allowed. Must be either 'asc' or 'desc'.`
        )
    }

    // TODO: This check limits the _index to Timestamp, will break the route for others
    let afterTimestamp = new Date()
    if (_after && _after.length > 0) {
        // If _after is provided ensure it can be parsed into an int
        if (!parseInt(_after as string)) {
            res.status(400).end(
                `_after ${_after} Not Allowed. Must be a parseable integer to convert to timestamp, e.g 1645079590.`
            )
        }
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
            parseInt(_size as string) > 100 ? 100 : parseInt(_size as string)
    }

    // Perform request
    switch (method) {
        case 'GET':
            await handleGet(res, _index, _order, afterTimestamp, limitSize)
            break
        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Method ${method} Not Allowed.`)
    }
}
