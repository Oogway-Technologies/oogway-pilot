import { NextApiRequest, NextApiResponse } from 'next'

import decryptAES from '../../utils/helpers/decryptAES'

export default (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const decryptedData = decryptAES(req.body.data)
        return res.status(200).json(decryptedData)
    } catch (err) {
        return res.status(403).json({ err: err })
    }
}
