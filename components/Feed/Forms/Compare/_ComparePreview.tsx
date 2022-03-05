import React, { FC } from 'react'
import { compareFormClass, postCardClass } from '../../../../styles/feed'
import { parseYoutubeVideoId } from '../../../../utils/helpers/common'
import YoutubeEmbed from '../../../Utils/YoutubeEmbed'
// @ts-ignore
import { UilTimesCircle } from '@iconscout/react-unicons'

interface ComparePreviewProps {
    text: string
    onClick: () => void
}

const _ComparePreview: FC<ComparePreviewProps> = ({ text, onClick }) => {
    return (
        <>
            <div className={compareFormClass.previewText}>
                {parseYoutubeVideoId(text) && <YoutubeEmbed text={text} />}
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
