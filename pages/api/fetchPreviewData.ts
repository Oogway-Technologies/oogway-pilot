// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getLinkPreview } from 'link-preview-js'

type ResponseURL = {
    url?: string
    title?: string
    siteName?: string | undefined
    description?: string | undefined
    mediaType?: string
    contentType?: string | undefined
    images?: string[]
    videos?: {
        url: string | undefined
        secureUrl: string | null | undefined
        type: string | null | undefined
        width: string | undefined
        height: string | undefined
    }[]
    favicons?: string[]
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<string[]>
) {
    const urlToHit = req?.query?.urlToHit || ''
    if (!urlToHit) {
        return res.status(400).json([])
    }

    //GET metadata of link
    getLinkPreview(`${urlToHit}`, {
        imagesPropertyType: 'og',
        timeout: 5000,
    }).then((data: ResponseURL) => {
        const image: string[] = data.images || []
        return res.status(200).json(image)
    })
}
