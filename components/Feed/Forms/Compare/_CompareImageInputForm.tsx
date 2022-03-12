/* eslint-disable react/display-name */
import { UilTimesCircle, UilUploadAlt } from '@iconscout/react-unicons'
import React, { ChangeEvent, MutableRefObject } from 'react'
import { useRecoilState } from 'recoil'

import {
    hasPreviewedCompare,
    imageCompareLeft,
    imageCompareRight,
    labelCompareLeft,
    labelCompareRight,
} from '../../../../atoms/compareForm'
import { fileSizeTooLarge } from '../../../../atoms/forms'
import { compareFormClass, postFormClass } from '../../../../styles/feed'
import { shortLimit, warningTime } from '../../../../utils/constants/global'
import preventDefaultOnEnter from '../../../../utils/helpers/preventDefaultOnEnter'
import { compareFilePickerRefs } from '../../../../utils/types/global'
import FlashErrorMessage from '../../../Utils/FlashErrorMessage'
import _CompareImagePreview from './_CompareImagePreview'
import _CompareInputForm from './_CompareInputForm'

interface _CompareImageInputFormProps {
    handleLeftUpload: (e: ChangeEvent<HTMLInputElement>) => void
    handleRightUpload: (e: ChangeEvent<HTMLInputElement>) => void
}

const _CompareImageInputForm = React.forwardRef<
    compareFilePickerRefs,
    _CompareImageInputFormProps
>(({ handleLeftUpload, handleRightUpload }, ref) => {
    // Image state
    const [isImageSizeLarge, setIsImageSizeLarge] =
        useRecoilState(fileSizeTooLarge)
    const [imageToCompareLeft, setImageToCompareLeft] =
        useRecoilState(imageCompareLeft)
    const [imageToCompareRight, setImageToCompareRight] =
        useRecoilState(imageCompareRight)
    const [labelToCompareLeft, setLabelToCompareLeft] =
        useRecoilState(labelCompareLeft)
    const [labelToCompareRight, setLabelToCompareRight] =
        useRecoilState(labelCompareRight)
    const [hasPreviewed, setHasPreviewed] = useRecoilState(hasPreviewedCompare)

    // Extract file picker refs
    const { left, right } = (ref as MutableRefObject<compareFilePickerRefs>)
        .current

    return (
        <div className={compareFormClass.container}>
            {hasPreviewed ? (
                <div className={compareFormClass.formContainer}>
                    <_CompareImagePreview
                        image={imageToCompareLeft as string}
                        label={labelToCompareLeft}
                        onClick={() => {
                            setHasPreviewed(false)
                            setImageToCompareLeft('')
                            setLabelToCompareLeft('')
                        }}
                    />
                    <_CompareImagePreview
                        image={imageToCompareRight as string}
                        label={labelToCompareRight}
                        onClick={() => {
                            setHasPreviewed(false)
                            setImageToCompareRight('')
                            setLabelToCompareRight('')
                        }}
                    />
                </div>
            ) : (
                <div className={compareFormClass.formContainer}>
                    <div>
                        {imageToCompareLeft ? (
                            <div className={postFormClass.imagePreview}>
                                <img
                                    className={compareFormClass.image}
                                    src={imageToCompareLeft as string} // Pass image to src
                                    alt=""
                                />
                                <UilTimesCircle
                                    className={postFormClass.removeImageButton}
                                    onClick={() => setImageToCompareLeft(null)}
                                />
                            </div>
                        ) : (
                            <button onClick={() => left?.current?.click()}>
                                <div className={compareFormClass.uploadButton}>
                                    <UilUploadAlt />
                                    <span>Upload your image</span>
                                </div>
                                <input
                                    ref={left}
                                    onChange={handleLeftUpload}
                                    type="file"
                                    accept="image/*"
                                    onKeyPress={preventDefaultOnEnter}
                                    hidden
                                />
                            </button>
                        )}
                        {isImageSizeLarge && (
                            <FlashErrorMessage
                                message={`Image should be less then 10 MB`}
                                ms={warningTime}
                                style={postFormClass.imageSizeAlert}
                                onClose={() => setIsImageSizeLarge(false)}
                            />
                        )}
                        <div className={compareFormClass.textInputDiv}>
                            <textarea
                                className={compareFormClass.caption}
                                placeholder="Caption (optional)"
                                onChange={e => {
                                    setLabelToCompareLeft(e.target.value)
                                }}
                                value={labelToCompareLeft}
                                maxLength={shortLimit}
                            />
                        </div>
                    </div>
                    <div>
                        {imageToCompareRight ? (
                            <div className={postFormClass.imagePreview}>
                                <img
                                    className={compareFormClass.image}
                                    src={imageToCompareRight as string} // Pass image to src
                                    alt=""
                                />
                                <UilTimesCircle
                                    className={postFormClass.removeImageButton}
                                    onClick={() => setImageToCompareRight(null)}
                                />
                            </div>
                        ) : (
                            <button onClick={() => right?.current?.click()}>
                                <div className={compareFormClass.uploadButton}>
                                    <UilUploadAlt />
                                    <span>Upload your image</span>
                                </div>
                                <input
                                    ref={right}
                                    onChange={handleRightUpload}
                                    type="file"
                                    accept="image/*"
                                    onKeyPress={preventDefaultOnEnter}
                                    hidden
                                />
                            </button>
                        )}
                        {isImageSizeLarge && (
                            <FlashErrorMessage
                                message={`Image should be less then 10 MB`}
                                ms={warningTime}
                                style={postFormClass.imageSizeAlert}
                                onClose={() => setIsImageSizeLarge(false)}
                            />
                        )}
                        <div className={compareFormClass.textInputDiv}>
                            <textarea
                                className={compareFormClass.caption}
                                placeholder="Caption (optional)"
                                onChange={e => {
                                    setLabelToCompareRight(e.target.value)
                                }}
                                value={labelToCompareRight}
                                maxLength={shortLimit}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
})

export default _CompareImageInputForm
