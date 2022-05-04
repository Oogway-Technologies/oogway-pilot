import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handleGet(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { question, context } = req.query

    try {
        const headers = {
            'Content-Type': 'application/json',
        }
        const url = 'http://3.22.185.47:8001/oogway_dt'
        const body = {
            question,
            context,
            token: '!!8GhQRj;t{1BS%',
        }
        const result = await axios.post(url, JSON.stringify(body), {
            url: url,
            headers: headers,
        })
        res.status(200).json(result.data)
    } catch (err) {
        res.status(403).json({ err: 'Error fetching suggestions' })
    }
}
