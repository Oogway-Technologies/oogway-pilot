import { NextApiRequest, NextApiResponse } from 'next'

import { OogwayDecisionAPI } from '../../../lib/axios/externalHandlers'
import { oogwayVars } from '../../../utils/constants/global'

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
    const { question, context } = req.query

    try {
        const headers = {
            'Content-Type': 'application/json',
        }
        const body = {
            question,
            context,
            token: oogwayVars.oogway_decision_token,
        }
        const result = await OogwayDecisionAPI.post(
            'oogway_dt',
            JSON.stringify(body),
            { headers: headers }
        ).catch(error => {
            console.log(error.toJSON())
            return { data: 'There was an error.' }
        })
        res.status(200).json(result.data)
    } catch (err) {
        res.status(403).json({ err: 'Error fetching suggestions' })
    }
}

export default async function aiSuggestionHandler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method } = req

    // Perform request
    if (method === 'GET') await handleGet(req, res)
    else {
        res.setHeader('Allow', ['GET'])
        res.status(405).end(`Method ${method} Not Allowed.`)
    }
}
