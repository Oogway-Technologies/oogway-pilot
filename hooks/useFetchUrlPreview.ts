import { useEffect, useState } from 'react'

import {
    fetcher,
    isValidURL,
    parseYoutubeVideoId,
} from '../utils/helpers/common'

// TODO: Fixx parser so that it extracts url anywhere in text
export const useFetchUrlPreview = (text: string) => {
    // Store preview image
    const [previewImage, setPreviewImage] = useState<string>('')

    // Fetch preview
    useEffect(() => {
        if (isValidURL(text) && !parseYoutubeVideoId(text)) {
            fetcher(`/api/fetchPreviewData?urlToHit=${text}`).then(res =>
                setPreviewImage(res[0])
            )
        }
    }, [text])

    return [previewImage, setPreviewImage] as const
}
