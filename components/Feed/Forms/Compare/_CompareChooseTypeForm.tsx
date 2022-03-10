import React, { ChangeEvent } from 'react'

// Styles and JSX
import { compareFormClass } from '../../../../styles/feed'
// @ts-ignore
import {
    UilTextFields,
    UilImageUpload,
    UilCancel,
    // @ts-ignore
} from '@iconscout/react-unicons'
import { useRecoilState, useSetRecoilState } from 'recoil'
import {
    compareFormExpanded,
    comparePostType,
    hasPreviewedCompare,
    imageCompareLeft,
    imageCompareRight,
    labelCompareLeft,
    labelCompareRight,
    textCompareLeft,
    textCompareRight,
} from '../../../../atoms/compareForm'
import { useMediaQuery } from '@mui/material'
import _CompareInputForm from './_CompareInputForm'
import { compareFilePickerRefs } from '../../../../utils/types/global'
import _CompareTextInputForm from './_CompareTextInputForm'
import _CompareImageInputForm from './_CompareImageInputForm'

interface _CompareChooseTypeFormProps {
    handleLeftUpload: (e: ChangeEvent<HTMLInputElement>) => void
    handleRightUpload: (e: ChangeEvent<HTMLInputElement>) => void
}

const _CompareChooseTypeForm = React.forwardRef<
    compareFilePickerRefs,
    _CompareChooseTypeFormProps
>(({ handleLeftUpload, handleRightUpload }, ref) => {
    // Update step
    const [compareType, setCompareType] = useRecoilState(comparePostType)
    const goToTextForm = () => {
        if (compareType !== 'textOnly') {
            setCompareType('textOnly')
            setHasPreviewed(false)
            setImageToCompareLeft('')
            setImageToCompareRight('')
            setLabelToCompareLeft('')
            setLabelToCompareRight('')
        }
    }
    const goToImageForm = () => {
        if (compareType !== 'imageOnly') {
            setCompareType('imageOnly')
            setHasPreviewed(false)
            setTextToCompareLeft('')
            setTextToCompareRight('')
        }
    }
    const cancelCompare = () => {
        setHasPreviewed(false)
        setExpanded(false)
        setTextToCompareLeft('')
        setTextToCompareRight('')
        setImageToCompareLeft('')
        setImageToCompareRight('')
        setLabelToCompareLeft('')
        setLabelToCompareRight('')
    }

    // Compare form state
    const setTextToCompareLeft = useSetRecoilState(textCompareLeft)
    const setTextToCompareRight = useSetRecoilState(textCompareRight)
    const setImageToCompareLeft = useSetRecoilState(imageCompareLeft)
    const setImageToCompareRight = useSetRecoilState(imageCompareRight)
    const setLabelToCompareLeft = useSetRecoilState(labelCompareLeft)
    const setLabelToCompareRight = useSetRecoilState(labelCompareRight)
    const setExpanded = useSetRecoilState(compareFormExpanded)
    const setHasPreviewed = useSetRecoilState(hasPreviewedCompare)

    // Track mobile state
    const isMobile = useMediaQuery('(max-width: 500px)')

    return (
        <div className="flex flex-col">
            <div className={compareFormClass.header}>
                <div>Create Poll</div>
                <div>
                    <button
                        className={compareFormClass.cancelButton}
                        onClick={cancelCompare}
                    >
                        <UilCancel size="30" />
                    </button>
                </div>
            </div>
            <_CompareInputForm>
                <>
                    {/* Toolbar */}
                    <div className={compareFormClass.chooseTypeToolbar}>
                        <div
                            className={compareFormClass.chooseTypeChild}
                            onClick={goToTextForm}
                        >
                            <UilTextFields size={isMobile ? '15' : '20'} />
                            <div
                                className={
                                    'text-xs ml-sm' +
                                    (compareType === 'textOnly'
                                        ? ' font-bold'
                                        : '')
                                }
                            >
                                Text
                            </div>
                        </div>
                        <div
                            className={
                                compareFormClass.chooseTypeChild + ' pl-sm'
                            }
                            onClick={goToImageForm}
                        >
                            <UilImageUpload size={isMobile ? '15' : '20'} />
                            <div
                                className={
                                    'text-xs ml-sm' +
                                    (compareType === 'imageOnly'
                                        ? ' font-bold'
                                        : '')
                                }
                            >
                                Image
                            </div>
                        </div>
                        <div></div>
                    </div>
                    {/* Forms */}
                    <div className={compareFormClass.container}>
                        {compareType === 'textOnly' ? (
                            <_CompareTextInputForm />
                        ) : (
                            <_CompareImageInputForm
                                ref={ref}
                                handleLeftUpload={handleLeftUpload}
                                handleRightUpload={handleRightUpload}
                            />
                        )}
                    </div>
                </>
            </_CompareInputForm>
        </div>
    )
})

export default _CompareChooseTypeForm
