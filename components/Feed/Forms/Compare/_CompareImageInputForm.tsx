import React, { ChangeEvent, FC, MutableRefObject } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import {
    UilAngleLeft,
    UilUploadAlt,
    UilTimesCircle,
    // @ts-ignore
} from '@iconscout/react-unicons'
import {
    comparePostType,
    hasPreviewedCompare,
    imageCompareLeft,
    imageCompareRight,
    labelCompareLeft,
    labelCompareRight,
} from '../../../../atoms/compareForm'
import { compareFormClass, postFormClass } from '../../../../styles/feed'
import { Tooltip } from '../../../Utils/Tooltip'
import _CompareInputForm from './_CompareInputForm'
import preventDefaultOnEnter from '../../../../utils/helpers/preventDefaultOnEnter'
import { compareFilePickerRefs } from '../../../../utils/types/global'
import FlashErrorMessage from '../../../Utils/FlashErrorMessage'
import { shortLimit, warningTime } from '../../../../utils/constants/global'
import { fileSizeTooLarge } from '../../../../atoms/forms'
import _CompareImagePreview from './_CompareImagePreview'

interface _CompareImageInputFormProps {
    handleLeftUpload: (e: ChangeEvent<HTMLInputElement>) => void
    handleRightUpload: (e: ChangeEvent<HTMLInputElement>) => void
}

const _CompareImageInputForm = React.forwardRef<
    compareFilePickerRefs,
    _CompareImageInputFormProps
>(({ handleLeftUpload, handleRightUpload }, ref) => {
    // Control form flow
    const setCompareType = useSetRecoilState(comparePostType)
    const goToChooseType = () => setCompareType('chooseType')

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
            <div className={compareFormClass.header}>
                <button
                    className={compareFormClass.goBackButton}
                    onClick={() => {
                        goToChooseType()
                        setHasPreviewed(false)
                        setImageToCompareLeft('')
                        setImageToCompareRight('')
                        setLabelToCompareLeft('')
                        setLabelToCompareRight('')
                    }}
                >
                    <UilAngleLeft /> <span className="mr-2">Go Back</span>
                </button>
            </div>
            <div className={compareFormClass.optionsSideBySide}>
                {hasPreviewed ? (
                    <>
                        <_CompareInputForm>
                            <_CompareImagePreview
                                image={imageToCompareLeft as string}
                                label={labelToCompareLeft}
                                onClick={() => {
                                    setHasPreviewed(false)
                                    setImageToCompareLeft('')
                                    setLabelToCompareLeft('')
                                }}
                            />
                        </_CompareInputForm>
                        <_CompareInputForm>
                            <_CompareImagePreview
                                image={imageToCompareRight as string}
                                label={labelToCompareRight}
                                onClick={() => {
                                    setHasPreviewed(false)
                                    setImageToCompareRight('')
                                    setLabelToCompareRight('')
                                }}
                            />
                        </_CompareInputForm>
                    </>
                ) : (
                    <>
                        <_CompareInputForm>
                            <div className="mt-sm">
                                {imageToCompareLeft ? (
                                    <div className={postFormClass.imagePreview}>
                                        <img
                                            className={compareFormClass.image}
                                            src={imageToCompareLeft as string} // Pass image to src
                                            alt=""
                                        />
                                        <UilTimesCircle
                                            className={
                                                postFormClass.removeImageButton
                                            }
                                            onClick={() =>
                                                setImageToCompareLeft(null)
                                            }
                                        />
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => left?.current!.click()}
                                    >
                                        <div
                                            className={
                                                compareFormClass.uploadButton
                                            }
                                        >
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
                                            setIsImageSizeLarge(false)
                                        }
                                    />
                                )}

                                <div className={compareFormClass.textInputDiv}>
                                    <textarea
                                        className={compareFormClass.caption}
                                        placeholder="Caption (optional)"
                                        onChange={e => {
                                            setLabelToCompareLeft(
                                                e.target.value,
                                            )
                                        }}
                                        value={labelToCompareLeft}
                                        maxLength={shortLimit}
                                    />
                                </div>
                            </div>
                        </_CompareInputForm>
                        <_CompareInputForm>
                            <div className="mt-sm">
                                {imageToCompareRight ? (
                                    <div className={postFormClass.imagePreview}>
                                        <img
                                            className={compareFormClass.image}
                                            src={imageToCompareRight as string} // Pass image to src
                                            alt=""
                                        />
                                        <UilTimesCircle
                                            className={
                                                postFormClass.removeImageButton
                                            }
                                            onClick={() =>
                                                setImageToCompareRight(null)
                                            }
                                        />
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => right?.current!.click()}
                                    >
                                        <div
                                            className={
                                                compareFormClass.uploadButton
                                            }
                                        >
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
                                            setIsImageSizeLarge(false)
                                        }
                                    />
                                )}
                                <div className={compareFormClass.textInputDiv}>
                                    <textarea
                                        className={compareFormClass.caption}
                                        placeholder="Caption (optional)"
                                        onChange={e => {
                                            setLabelToCompareRight(
                                                e.target.value,
                                            )
                                        }}
                                        value={labelToCompareRight}
                                        maxLength={shortLimit}
                                    />
                                </div>
                            </div>
                        </_CompareInputForm>
                    </>
                )}
            </div>
        </div>
    )
})

export default _CompareImageInputForm
