import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'

import { oogwayVars } from '../../utils/constants/global'

export default async function handleGet(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { question, context } = req.query

    try {
        const headers = {
            'Content-Type': 'application/json',
        }
        const url = `${oogwayVars.oogway_decision_url}oogway_dt`
        const body = {
            question,
            context,
            token: oogwayVars.oogway_decision_token,
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
