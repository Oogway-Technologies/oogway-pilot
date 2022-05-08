import { NextApiRequest, NextApiResponse } from 'next'

import { OogwayDecisionAPI } from '../../../lib/axios/externalHandlers'
import { oogwayVars } from '../../../utils/constants/global'
import { FirebaseDecisionCriteriaInfo } from '../../../utils/types/firebase'

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { _version, _decision, _option, _criterion } = req.query

        const headers = {
            'Content-Type': 'application/json',
        }
        const payload = {
            decision: _decision,
            option: _option,
            criterion: _criterion,
            token: oogwayVars.oogway_decision_token,
        }
        const result = await OogwayDecisionAPI.post(
            `oogway_ft/${_version}`,
            payload,
            { headers: headers }
        ).catch(error => {
            console.log(error.toJSON())
            return { data: 'There was an error.' }
        })
        return res.status(200).json({
            results: result.data as FirebaseDecisionCriteriaInfo,
            err: null,
        })
    } catch (err) {
        res.status(403).json({ err: 'Error fetching suggestions' })
    }
}

export default async function decisionCriteriaInfoHandler(
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
