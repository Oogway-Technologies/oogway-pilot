import { UilTimesCircle } from '@iconscout/react-unicons'
import React, { FC } from 'react'

import { useFetchUrlPreview } from '../../../hooks/useFetchUrlPreview'
import { compareFormClass, postCardClass } from '../../../styles/feed'

type CompareImagePreviewProps = {
    image: string
    label?: string
    onClick: () => void
}

const _CompareImagePreview: FC<
    React.PropsWithChildren<React.PropsWithChildren<CompareImagePreviewProps>>
> = ({ image, label, onClick }) => {
    // Parse text and fetch preview
    const [previewImage] = useFetchUrlPreview(label as string)

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
                                : ' inline-flex justify-center p-sm') +
                            (previewImage ? ' truncate' : '')
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
