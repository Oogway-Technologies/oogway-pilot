import React, { useEffect, useState } from 'react'

import { defaultProfileImage } from '../../utils/constants/global'
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
                if (imageUrl.length) {
                    setIsUrlPreviewImage(imageUrl[0])
                } else {
                    setIsUrlPreviewImage('')
                }
            })
        }
    }, [])

    return isUrlPreviewImage || isYoutubeLink ? (
        <div className={'ml-xl flex justify-start'}>
            {isYoutubeLink && isYoutubeLink.length > 0 ? (
                <iframe
                    src={`https://www.youtube.com/embed/${isYoutubeLink}`}
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    title="video"
                    className="m-md"
                />
            ) : isUrlPreviewImage ? (
                <img
                    src={isUrlPreviewImage}
                    alt="no-image-found"
                    className={'m-md h-full max-w-full'}
                    onError={e => {
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.src = defaultProfileImage
                    }}
                />
            ) : (
                <></>
            )}
        </div>
    ) : (
        <></>
    )
}
