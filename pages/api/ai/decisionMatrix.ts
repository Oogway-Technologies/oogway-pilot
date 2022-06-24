import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

import { aiMatrixURL, matrixToken } from '../../../utils/constants/global'

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
    const { question, context } = req.body
    if (!question) {
        return res.status(400).json({ err: 'Missing question' })
    }
    try {
        const headers = {
            'Content-Type': 'application/json',
        }

        const response = await axios.post(
            aiMatrixURL,
            {
                decision: question,
                context,
                token: matrixToken,
            },
            { headers }
        )
        res.status(200).json(response.data)
    } catch (error) {
        console.log()

        const err = error as {
            message: string
            status: number
        }
        res.status(404).json({ message: err.message, error })
    }
}

export default handler
