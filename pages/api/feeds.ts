import {
    collection,
    getDocs,
    orderBy,
    OrderByDirection,
    query,
} from 'firebase/firestore'
import { NextApiRequest, NextApiResponse } from 'next'

import { db } from '../../firebase'

async function handleGet(res: NextApiResponse, _index: string, _order: string) {
    try {
        // Get feeds from firebase
        const q = query(
            collection(db, 'feeds'),
            orderBy(_index, <OrderByDirection>_order)
        )
        const feedSnapshot = await getDocs(q)
        const feeds = feedSnapshot.docs.map(feed => ({
            id: feed.id,
            ...feed.data(),
        }))

        // Check to ensure feeds found
        if (feeds.length === 0) {
            res.status(404).end(
                'No Results Found. Please check the query parameters.'
            )
        }

        // Return payload
        const payload = {
            feeds: feeds,
        }
        res.status(200).json(payload)
    } catch (err) {
        res.status(403).json({ err: 'Error!' })
    }
}

export default async function feedHandler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    let {
        query: { _index, _order },
        method,
    } = req

    // Check query params and set defaults
    //  TODO: may want to wrap this into the GET handler function
    _index = _index ? (_index as string) : 'label'
    if (!(_index === 'label' || _index === 'timestamp')) {
        res.status(400).end(
            `_index ${_index} Not Allowed. Must be either 'timestamp' or 'label'.`
        )
    }

    _order = _order ? (_order as string) : 'asc'
    if (!(_order === 'asc' || _order === 'desc')) {
        res.status(400).end(
            `_order ${_order} Not Allowed. Must be either 'asc' or 'desc'.`
        )
    }

    // Perform request
    switch (method) {
        case 'GET':
            await handleGet(res, _index, _order)
            break
        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Method ${method} Not Allowed.`)
    }
}
