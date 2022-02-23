// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {collection, getDocs, limit, orderBy, OrderByDirection, query, startAfter} from 'firebase/firestore'
import type {NextApiRequest, NextApiResponse} from 'next'
import {db} from '../../firebase'
import {PostTimeStamp} from "../../utils/types/global";


/**
 * 
 * @param req request
 * @param res response
 * 
 * The request query accepts the following params:
 * _index: the _index to sort the data on, defaults to timestamp
 * _order: accepts 'asc' for ascending or 'desc' for descending
 * _after: The current timestamp in seconds for the query cursor to start _after
 * _size: the number of posts to return, defaults to 10
 */

export default async function postsHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    let {
        query: {_index, _order, _after, _size},
        method
    } = req

    // Check query params and set defaults
    _index = _index ? _index as string : 'timestamp'
    if (!(_index === 'timestamp' || _index === 'uid')) {
        res.status(400).end(`_index ${_index} Not Allowed. Must be either 'timestamp' or 'uid'.`)
    }
    
    _order = _order ? _order as string: 'desc'
    if (!(_order === 'asc' || _order === 'desc')) {
        res.status(400).end(`_order ${_order} Not Allowed. Must be either 'asc' or 'desc'.`)
    }
    

    // TODO: This check limits the _index to Timestamp, will break the route for others
    let afterTimestamp = new Date()
    if (_after && _after.length > 0) {
        // If _after is provided ensure it can be parsed into an int
        if (!parseInt(_after as string)) {
            res.status(400).end(`_after ${_after} Not Allowed. Must be a parseable integer to convert to timestamp, e.g 1645079590.`)
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
            res.status(400).end(`_size ${_size} Not Allowed. Must be a parseable integer.`)
        }

        // If _size exceeds 100, cap at 100
        limitSize = parseInt(_size as string) > 100 ? 100 : parseInt(_size as string)     
    }


    // Perform request
    switch (method) {
        case 'GET':
            // Get posts from firebase
            const q = query(
                collection(db, 'posts'),
                orderBy(_index, <OrderByDirection>_order),
                startAfter(afterTimestamp), // Default to current time
                limit(limitSize) // Default to 25
            )
            const postsSnapshot = await getDocs(q)
            const posts = postsSnapshot.docs.map((post) => ({
                    id: post.id,
                    ...post.data()
                }))
            
            // Check to ensure posts found
            if (posts.length === 0) {
                res.status(404).end('No Results Found. Please check the query parameters.')
            }

            const lastTime = posts[posts.length-1] as PostTimeStamp
            const firstTime = posts[0] as PostTimeStamp
            // Return payload
            const payload = {
                posts: posts,
                lastTimestamp: lastTime?.timestamp || 0,
                firstTimestamp: firstTime?.timestamp || 0,
                hasNextPage: (posts.length === limitSize) // If full limit reached there may be another page, edge case is modulo 0
            }
            res.status(200).json(payload)
            break
        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Method ${method} Not Allowed.`)
    }
}
