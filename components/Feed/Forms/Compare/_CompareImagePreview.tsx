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
        <>
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
                            (label.split('').length > 20
                                ? ' break-words text-center truncate p-sm'
                                : ' inline-flex w-full justify-center p-sm')
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
        </>
    )
}

export default _CompareImagePreview
