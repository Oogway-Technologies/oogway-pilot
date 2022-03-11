import { CardMedia } from '@mui/material'
import React, { useEffect, useState } from 'react'
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
        <div className={'flex ml-xl p-md'}>
            {isYoutubeLink && isYoutubeLink.length > 0 ? (
                <iframe
                    width="800"
                    height="400"
                    src={`https://www.youtube.com/embed/${isYoutubeLink}`}
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    title="video"
                />
            ) : (
                <CardMedia component="img" src={isUrlPreviewImage} alt="img" />
            )}
        </div>
    )
}
