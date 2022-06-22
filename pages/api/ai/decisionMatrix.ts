import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

import { aiMatrixURL, matrixToken } from '../../../utils/constants/global'

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
    const { decision, context } = req.query
    if (!decision) {
        return res.status(400).json({ err: 'Missing decision' })
    }
    try {
        const headers = {
            'Content-Type': 'application/json',
        }

        const response = await axios.post(
            aiMatrixURL,
            {
                decision,
                context,
                token: matrixToken,
            },
            { headers }
        )
        res.status(200).json(response.data)
    } catch (error) {
        console.log(error)

        const err = error as {
            message: string
            status: number
        }
        res.status(400).json({ message: err.message, error })
    }
}

export default handler
