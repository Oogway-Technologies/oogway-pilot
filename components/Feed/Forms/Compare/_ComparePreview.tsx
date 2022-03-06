import React, { FC, useEffect, useState } from 'react'
import { compareFormClass, postCardClass } from '../../../../styles/feed'
import {
    fetcher,
    isValidURL,
    parseYoutubeVideoId,
} from '../../../../utils/helpers/common'
import YoutubeEmbed from '../../../Utils/YoutubeEmbed'
// @ts-ignore
import { UilTimesCircle } from '@iconscout/react-unicons'

interface ComparePreviewProps {
    text: string
    onClick: () => void
}

const _ComparePreview: FC<ComparePreviewProps> = ({ text, onClick }) => {
    const [previewImage, setPreviewImage] = useState('')
    useEffect(() => {
        if (isValidURL(text) && !parseYoutubeVideoId(text)) {
            ;(async () => {
                const res = await fetcher(
                    `/api/fetchPreviewData?urlToHit=${text}`,
                )
                setPreviewImage(res[0])
            })()
        }
    }, [text])
    return (
        <>
            <div className={compareFormClass.previewText}>
                {parseYoutubeVideoId(text) ? (
                    <YoutubeEmbed text={text} />
                ) : (
                    previewImage && (
                        <img
                            src={previewImage}
                            alt={''}
                            className={
                                'flex rounded-[8px] object-contain cursor-pointer mb-3'
                            }
                        />
                    )
                )}
                <div
                    className={
                        postCardClass.textVote +
                        (text.split('').length > 20
                            ? ' text-start truncate w-full p-sm'
                            : ' inline-flex w-full justify-center p-sm')
                    }
                >
                    {text}
                </div>
            </div>
            <UilTimesCircle
                className={compareFormClass.undoChoice}
                onClick={onClick}
            />
        </>
    )
}

export default _ComparePreview
