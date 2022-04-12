/* eslint-disable react/display-name */
import {
    UilCancel,
    UilImageUpload,
    UilTextFields,
} from '@iconscout/react-unicons'
import React, { ChangeEvent } from 'react'

import {
    setCompareFormExpanded,
    setComparePostType,
    setHasPreviewedCompare,
    setImageCompareLeft,
    setImageCompareRight,
    setLabelCompareLeft,
    setLabelCompareRight,
    setTextCompareLeft,
    setTextCompareRight,
} from '../../../features/utils/utilsSlice'
import useMediaQuery from '../../../hooks/useMediaQuery'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
// Styles and JSX
import { compareFormClass } from '../../../styles/feed'
import { compareFilePickerRefs } from '../../../utils/types/global'
import _CompareImageInputForm from './_CompareImageInputForm'
import _CompareInputForm from './_CompareInputForm'
import _CompareTextInputForm from './_CompareTextInputForm'

interface _CompareChooseTypeFormProps {
    handleLeftUpload: (e: ChangeEvent<HTMLInputElement>) => void
    handleRightUpload: (e: ChangeEvent<HTMLInputElement>) => void
}

const _CompareChooseTypeForm = React.forwardRef<
    compareFilePickerRefs,
    _CompareChooseTypeFormProps
>(({ handleLeftUpload, handleRightUpload }, ref) => {
    const { comparePostType } = useAppSelector(
        state => state.utilsSlice.compareForm
    )

    const goToTextForm = () => {
        if (comparePostType !== 'textOnly') {
            useAppDispatch(setComparePostType('textOnly'))
            useAppDispatch(setHasPreviewedCompare(false))
            useAppDispatch(setImageCompareLeft(''))
            useAppDispatch(setImageCompareRight(''))
            useAppDispatch(setLabelCompareLeft(''))
            useAppDispatch(setLabelCompareRight(''))
        }
    }
    const goToImageForm = () => {
        if (comparePostType !== 'imageOnly') {
            useAppDispatch(setComparePostType('imageOnly'))
            useAppDispatch(setHasPreviewedCompare(false))
            useAppDispatch(setTextCompareLeft(''))
            useAppDispatch(setTextCompareRight(''))
        }
    }
    const cancelCompare = () => {
        useAppDispatch(setHasPreviewedCompare(false))
        useAppDispatch(setCompareFormExpanded(false))
        useAppDispatch(setTextCompareLeft(''))
        useAppDispatch(setTextCompareRight(''))
        useAppDispatch(setImageCompareLeft(''))
        useAppDispatch(setImageCompareRight(''))
        useAppDispatch(setLabelCompareLeft(''))
        useAppDispatch(setLabelCompareRight(''))
    }

    // Track mobile state
    const isMobile = useMediaQuery('(max-width: 500px)')

    return (
        <div className="flex flex-col text-black dark:text-neutralDark-50">
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
                                    (comparePostType === 'textOnly'
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
                                    (comparePostType === 'imageOnly'
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
                        {comparePostType === 'textOnly' ? (
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
