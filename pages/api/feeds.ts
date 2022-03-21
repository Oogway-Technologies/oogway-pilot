import {
    collection,
    getDocs,
    orderBy,
    OrderByDirection,
    query,
} from 'firebase/firestore'
import { NextApiRequest, NextApiResponse } from 'next'

import { db } from '../../firebase'

export default async function feedHandler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    let {
        query: { _index, _order },
        method,
    } = req

    // Check query params and set defaults
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
    if (method === 'GET') {
        // Get posts from firebase
        const q = query(
            collection(db, 'feeds'),
            orderBy(_index, <OrderByDirection>_order)
        )
        const feedSnapshot = await getDocs(q)
        const feeds = feedSnapshot.docs.map(feed => ({
            id: feed.id,
            ...feed.data(),
        }))

        // Check to ensure posts found
        if (feeds.length === 0) {
            res.status(404).end(
                'No Results Found. Please check the query parameters.'
            )
        }

        // Return payload
        const payload = {
            feeds: feeds,
            // lastTimestamp: lastTime?.timestamp || 0,
            // firstTimestamp: firstTime?.timestamp || 0,
            // hasNextPage: posts.length === limitSize, // If full limit reached there may be another page, edge case is modulo 0
        }
        res.status(200).json(payload)
    } else {
        res.setHeader('Allow', ['GET'])
        res.status(405).end(`Method ${method} Not Allowed.`)
    }
}
