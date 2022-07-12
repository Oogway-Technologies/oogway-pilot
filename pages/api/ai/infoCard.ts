import type { NextApiRequest, NextApiResponse } from 'next'

import { OogwayBeanstalkAPI } from '../../../lib/axios/externalHandlers'

const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
    const { decision, context } = req.body
    if (!decision) {
        return res.status(400).json({ err: 'Missing decision field in body.' })
    }
    try {
        const response = await OogwayBeanstalkAPI.post('api/v1/data/infoCard', {
            decision,
            context,
        })
        res.status(200).json(response.data)
    } catch (error) {
        const err = error as {
            message: string
            status: number
        }
        res.status(404).json({ message: err.message, error })
    }
}

export default async function infoCardHandler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method } = req

    // Perform request
    if (method === 'POST') await handlePost(req, res)
    else {
        res.setHeader('Allow', ['POST'])
        res.status(405).end(`Method ${method} Not Allowed.`)
    }
}
