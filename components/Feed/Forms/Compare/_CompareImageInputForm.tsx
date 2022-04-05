/* eslint-disable react/display-name */
import { UilTimesCircle, UilUploadAlt } from '@iconscout/react-unicons'
import React, { ChangeEvent, MutableRefObject } from 'react'

import {
    setFileSizeTooLarge,
    setHasPreviewedCompare,
    setImageCompareLeft,
    setImageCompareRight,
    setLabelCompareLeft,
    setLabelCompareRight,
} from '../../../../features/utils/utilsSlice'
import { useAppDispatch, useAppSelector } from '../../../../hooks/useRedux'
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
    const isImageSizeLarge = useAppSelector(
        state => state.utilsSlice.fileSizeTooLarge
    )
    const {
        hasPreviewedCompare,
        imageCompareLeft,
        imageCompareRight,
        labelCompareLeft,
        labelCompareRight,
    } = useAppSelector(state => state.utilsSlice.compareForm)

    // Extract file picker refs
    const { left, right } = (ref as MutableRefObject<compareFilePickerRefs>)
        .current

    return (
        <div className={compareFormClass.container}>
            {hasPreviewedCompare ? (
                <div className={compareFormClass.formContainer}>
                    <_CompareImagePreview
                        image={imageCompareLeft as string}
                        label={labelCompareLeft}
                        onClick={() => {
                            useAppDispatch(setHasPreviewedCompare(false))
                            useAppDispatch(setImageCompareLeft(''))
                            useAppDispatch(setLabelCompareLeft(''))
                        }}
                    />
                    <_CompareImagePreview
                        image={imageCompareRight as string}
                        label={labelCompareRight}
                        onClick={() => {
                            useAppDispatch(setHasPreviewedCompare(false))
                            useAppDispatch(setImageCompareRight(''))
                            useAppDispatch(setLabelCompareRight(''))
                        }}
                    />
                </div>
            ) : (
                <div className={compareFormClass.formContainer}>
                    <div>
                        {imageCompareLeft ? (
                            <div className={postFormClass.imagePreview}>
                                <img
                                    className={compareFormClass.image}
                                    src={imageCompareLeft as string} // Pass image to src
                                    alt=""
                                />
                                <UilTimesCircle
                                    className={postFormClass.removeImageButton}
                                    onClick={() =>
                                        useAppDispatch(
                                            setImageCompareLeft(null)
                                        )
                                    }
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
                                onClose={() =>
                                    useAppDispatch(setFileSizeTooLarge(false))
                                }
                            />
                        )}
                        <div className={compareFormClass.textInputDiv}>
                            <textarea
                                className={compareFormClass.caption}
                                placeholder="Caption (optional)"
                                onChange={e => {
                                    useAppDispatch(
                                        setLabelCompareLeft(e.target.value)
                                    )
                                }}
                                value={labelCompareLeft}
                                maxLength={shortLimit}
                            />
                        </div>
                    </div>
                    <div>
                        {imageCompareRight ? (
                            <div className={postFormClass.imagePreview}>
                                <img
                                    className={compareFormClass.image}
                                    src={imageCompareRight as string} // Pass image to src
                                    alt=""
                                />
                                <UilTimesCircle
                                    className={postFormClass.removeImageButton}
                                    onClick={() =>
                                        useAppDispatch(
                                            setImageCompareRight(null)
                                        )
                                    }
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
                                onClose={() =>
                                    useAppDispatch(setFileSizeTooLarge(false))
                                }
                            />
                        )}
                        <div className={compareFormClass.textInputDiv}>
                            <textarea
                                className={compareFormClass.caption}
                                placeholder="Caption (optional)"
                                onChange={e => {
                                    useAppDispatch(
                                        setLabelCompareRight(e.target.value)
                                    )
                                }}
                                value={labelCompareRight}
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
