import React, { FC } from 'react'
import {
    compareFormClass,
    postCardClass,
    postFormClass,
} from '../../../../styles/feed'
// @ts-ignore
import { UilTimesCircle } from '@iconscout/react-unicons'

type CompareImagePreviewProps = {
    image: string
    label?: string
    onClick: () => void
}

const _CompareImagePreview: FC<CompareImagePreviewProps> = ({
    image,
    label,
    onClick,
}) => {
    return (
        <div className="flex-col">
            <img
                className={compareFormClass.image}
                src={image as string} // Pass image to src
                alt=""
            />
            {label && (
                <div className={postCardClass.textVote + ' mt-sm'}>
                    <div
                        className={
                            compareFormClass.previewText +
                            ' w-48' +
                            (label.split('').length > 20
                                ? ' break-words text-center p-sm'
                                : ' inline-flex justify-center p-sm')
                        }
                    >
                        {label}
                    </div>
                </div>
            )}
            <UilTimesCircle
                className={compareFormClass.undoChoice}
                onClick={onClick}
            />
        </div>
    )
}

export default _CompareImagePreview
