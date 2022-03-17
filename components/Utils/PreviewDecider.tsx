import React, { useEffect, useState } from 'react'

import { cardMediaStyle } from '../../styles/utils'
import {
    fetcher,
    isValidURL,
    parseYoutubeVideoId,
} from '../../utils/helpers/common'

interface PreviewDeciderProps {
    textToDetect: string
}

export const PreviewDecider = ({ textToDetect }: PreviewDeciderProps) => {
    const [isUrlPreviewImage, setIsUrlPreviewImage] = useState('')
    const isYoutubeLink = parseYoutubeVideoId(textToDetect)

    useEffect(() => {
        if (isValidURL(textToDetect)) {
            fetcher(
                `/api/fetchPreviewData?urlToHit=${isValidURL(textToDetect)}`
            ).then(imageUrl => {
                setIsUrlPreviewImage(imageUrl)
            })
        }
    }, [textToDetect])

    return (
        <div className={'flex p-md ml-xl'}>
            {isYoutubeLink && isYoutubeLink.length > 0 ? (
                <iframe
                    src={`https://www.youtube.com/embed/${isYoutubeLink}`}
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    title="video"
                />
            ) : (
                <img
                    src={isUrlPreviewImage}
                    alt="img"
                    className={cardMediaStyle}
                />
            )}
        </div>
    )
}
