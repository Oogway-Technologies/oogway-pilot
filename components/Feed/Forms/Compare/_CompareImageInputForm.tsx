import React, { ChangeEvent, FC } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import {
    UilAngleLeft,
    UilUploadAlt,
    UilTimesCircle,
    // @ts-ignore
} from '@iconscout/react-unicons'
import {
    comparePostType,
    imageCompareLeft,
    imageCompareRight,
} from '../../../../atoms/compareForm'
import { compareFormClass, postFormClass } from '../../../../styles/feed'
import { Tooltip } from '../../../Utils/Tooltip'
import _CompareInputForm from './_CompareInputForm'
import preventDefaultOnEnter from '../../../../utils/helpers/preventDefaultOnEnter'
import { compareFilePickerRefs } from '../../../../utils/types/global'
import FlashErrorMessage from '../../../Utils/FlashErrorMessage'
import { warningTime } from '../../../../utils/constants/global'
import { fileSizeTooLarge } from '../../../../atoms/forms'

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

    // Extract file picker refs
    const { left, right } = ref.current

    return (
        <div className="flex flex-col">
            <div className={compareFormClass.header}>
                <Tooltip toolTipText={'Go Back'}>
                    <button
                        className={compareFormClass.goBackButton}
                        onClick={goToChooseType}
                    >
                        <UilAngleLeft />
                    </button>
                </Tooltip>
                Image Only
            </div>
            {/* <div className={compareFormClass.smallGreyText + ' ml-xl'}>
                Image Only
            </div> */}
            <div className={compareFormClass.optionsSideBySide}>
                {/* Left Tab */}
                <_CompareInputForm title="First Option">
                    <div className="mt-sm">
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
                            <button onClick={() => left?.current.click()}>
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
                                className={compareFormClass.textInput}
                                placeholder="Label your first option"
                            />
                        </div>
                    </div>
                </_CompareInputForm>
                {/* Right tab */}
                <_CompareInputForm title="Second Option">
                    <div className="mt-sm">
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
                            <button onClick={() => right?.current.click()}>
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
                                className={compareFormClass.textInput}
                                placeholder="Label your second option"
                            />
                        </div>
                    </div>
                </_CompareInputForm>
            </div>
        </div>
    )
})

export default _CompareImageInputForm
