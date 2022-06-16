import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
    const { decision, context } = req.query
    if (!decision) {
        return res.status(400).json({ err: 'Missing decision' })
    }
    try {
        const headers = {
            'Content-Type': 'application/json',
        }
        const url = 'http://3.130.66.102:5001/api/v1/decision_table'
        const response = await axios.post(
            url,
            {
                decision,
                context,
                token: "Jv'$eup*8_<qCX3(",
            },
            { headers }
        )
        console.log('response--------------', response)
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
