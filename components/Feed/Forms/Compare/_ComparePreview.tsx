import React, { FC, useEffect, useState } from 'react'
import { compareFormClass, postCardClass } from '../../../../styles/feed'
import { parseYoutubeVideoId } from '../../../../utils/helpers/common'
import YoutubeEmbed from '../../../Utils/YoutubeEmbed'
// @ts-ignore
import { UilTimesCircle } from '@iconscout/react-unicons'
import { useMediaQuery } from '@mui/material'
import { useFetchUrlPreview } from '../../../../hooks/useFetchUrlPreview'

interface ComparePreviewProps {
    text: string
    onClick: () => void
}

const _ComparePreview: FC<ComparePreviewProps> = ({ text, onClick }) => {
    // Parse text and fetch preview
    const [previewImage] = useFetchUrlPreview(text)

    // Calculate truncation
    const isMobile = useMediaQuery('(max-width: 500px)')
    const calcTruncate = () => {
        return isMobile ? 15 : 20
    }

    return (
        <div className="flex-col">
            {parseYoutubeVideoId(text) ? (
                // If Youtube link, parse and truncate label
                <div>
                    <YoutubeEmbed text={text} />
                    <div className={postCardClass.textVote + ' mt-sm'}>
                        <div
                            className={
                                // compareFormClass.previewText +
                                text.split('').length > calcTruncate()
                                    ? ' text-center truncate p-sm'
                                    : ' inline-flex w-full justify-center p-sm'
                            }
                        >
                            {text}
                        </div>
                    </div>
                </div>
            ) : previewImage ? (
                // If just image, display fetched image and truncate url
                <>
                    <img
                        src={previewImage}
                        alt={''}
                        className={
                            compareFormClass.image + ' cursor-pointer mb-3'
                        }
                    />
                    <div className={postCardClass.textVote + ' mt-sm'}>
                        <div
                            className={
                                compareFormClass.previewText +
                                (text.split('').length > 20
                                    ? ' break-words text-center truncate p-sm'
                                    : ' inline-flex w-full justify-center p-sm')
                            }
                        >
                            {text}
                        </div>
                    </div>
                </>
            ) : (
                <div
                    className={
                        postCardClass.textVote +
                        compareFormClass.previewText +
                        (text.split('').length > 20
                            ? ' break-words text-center p-sm'
                            : ' inline-flex justify-center p-sm')
                    }
                >
                    {text}
                </div>
            )}
            <UilTimesCircle
                className={compareFormClass.undoChoice}
                onClick={onClick}
            />
        </div>
    )
}

export default _ComparePreview
