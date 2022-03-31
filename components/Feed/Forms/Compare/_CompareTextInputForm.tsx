import React from 'react'

import {
    setHasPreviewedCompare,
    setTextCompareLeft,
    setTextCompareRight,
} from '../../../../features/utils/utilsSlice'
import { useAppDispatch, useAppSelector } from '../../../../hooks/useRedux'
import { compareFormClass } from '../../../../styles/feed'
import { shortLimit } from '../../../../utils/constants/global'
import _CompareInputForm from './_CompareInputForm'
import _ComparePreview from './_ComparePreview'

const _CompareTextInputForm = () => {
    const { hasPreviewedCompare, textCompareLeft, textCompareRight } =
        useAppSelector(state => state.utilsSlice.compareForm)

    return (
        <div className={compareFormClass.formContainer}>
            {hasPreviewedCompare ? (
                <>
                    <_ComparePreview
                        text={textCompareLeft}
                        onClick={() => {
                            useAppDispatch(setHasPreviewedCompare(false))
                            useAppDispatch(setTextCompareLeft(''))
                        }}
                    />

                    <_ComparePreview
                        text={textCompareRight}
                        onClick={() => {
                            useAppDispatch(setHasPreviewedCompare(false))
                            useAppDispatch(setTextCompareRight(''))
                        }}
                    />
                </>
            ) : (
                <>
                    <div className={compareFormClass.textInputDiv}>
                        <textarea
                            className={compareFormClass.textInput}
                            placeholder="First option ..."
                            onChange={e => {
                                useAppDispatch(
                                    setTextCompareLeft(e.target.value)
                                )
                            }}
                            value={textCompareLeft}
                            maxLength={shortLimit}
                        />
                    </div>
                    <div className={compareFormClass.textInputDiv}>
                        <textarea
                            className={compareFormClass.textInput}
                            placeholder="Second option ..."
                            onChange={e => {
                                useAppDispatch(
                                    setTextCompareRight(e.target.value)
                                )
                            }}
                            value={textCompareRight}
                            maxLength={shortLimit}
                        />
                    </div>
                </>
            )}
        </div>
    )
}

export default _CompareTextInputForm
