import React from 'react'
import { useRecoilState } from 'recoil'

import {
    hasPreviewedCompare,
    textCompareLeft,
    textCompareRight,
} from '../../../../atoms/compareForm'
import { compareFormClass } from '../../../../styles/feed'
import { shortLimit } from '../../../../utils/constants/global'
import _CompareInputForm from './_CompareInputForm'
import _ComparePreview from './_ComparePreview'

const _CompareTextInputForm = () => {
    // Form state
    const [textToCompareLeft, setTextToCompareLeft] =
        useRecoilState(textCompareLeft)
    const [textToCompareRight, setTextToCompareRight] =
        useRecoilState(textCompareRight)
    const [hasPreviewed, setHasPreviewed] = useRecoilState(hasPreviewedCompare)

    return (
        <div className={compareFormClass.formContainer}>
            {hasPreviewed ? (
                <>
                    <_ComparePreview
                        text={textToCompareLeft}
                        onClick={() => {
                            setHasPreviewed(false)
                            setTextToCompareLeft('')
                        }}
                    />

                    <_ComparePreview
                        text={textToCompareRight}
                        onClick={() => {
                            setHasPreviewed(false)
                            setTextToCompareRight('')
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
                                setTextToCompareLeft(e.target.value)
                            }}
                            value={textToCompareLeft}
                            maxLength={shortLimit}
                        />
                    </div>
                    <div className={compareFormClass.textInputDiv}>
                        <textarea
                            className={compareFormClass.textInput}
                            placeholder="Second option ..."
                            onChange={e => {
                                setTextToCompareRight(e.target.value)
                            }}
                            value={textToCompareRight}
                            maxLength={shortLimit}
                        />
                    </div>
                </>
            )}
        </div>
    )
}

export default _CompareTextInputForm
