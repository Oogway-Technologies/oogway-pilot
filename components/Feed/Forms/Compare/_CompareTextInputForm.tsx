import React from 'react'
import { compareFormClass } from '../../../../styles/feed'
// @ts-ignore
import { UilAngleLeft } from '@iconscout/react-unicons'
import { useSetRecoilState, useRecoilState } from 'recoil'
import {
    comparePostType,
    hasPreviewedCompare,
    textCompareLeft,
    textCompareRight,
} from '../../../../atoms/compareForm'
import { Tooltip } from '../../../Utils/Tooltip'
import _CompareInputForm from './_CompareInputForm'
import { shortLimit } from '../../../../utils/constants/global'
import _ComparePreview from './_ComparePreview'

const _CompareTextInputForm = () => {
    // Control form flow
    const setCompareType = useSetRecoilState(comparePostType)
    const goToChooseType = () => setCompareType('chooseType')

    // Form state
    const [textToCompareLeft, setTextToCompareLeft] =
        useRecoilState(textCompareLeft)
    const [textToCompareRight, setTextToCompareRight] =
        useRecoilState(textCompareRight)
    const [hasPreviewed, setHasPreviewed] = useRecoilState(hasPreviewedCompare)

    return (
        <div className={compareFormClass.container}>
            <div className={compareFormClass.header}>
                <button
                    className={compareFormClass.goBackButton}
                    onClick={() => {
                        goToChooseType()
                        setHasPreviewed(false)
                        setTextToCompareLeft('')
                        setTextToCompareRight('')
                    }}
                >
                    <UilAngleLeft /> <span className="mr-2">Go Back</span>
                </button>
            </div>
            <div className={compareFormClass.optionsSideBySide}>
                {hasPreviewed ? (
                    <>
                        <_CompareInputForm>
                            <_ComparePreview
                                text={textToCompareLeft}
                                onClick={() => {
                                    setHasPreviewed(false)
                                    setTextToCompareLeft('')
                                }}
                            />
                        </_CompareInputForm>

                        <_CompareInputForm>
                            <_ComparePreview
                                text={textToCompareRight}
                                onClick={() => {
                                    setHasPreviewed(false)
                                    setTextToCompareRight('')
                                }}
                            />
                        </_CompareInputForm>
                    </>
                ) : (
                    <>
                        <_CompareInputForm>
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
                        </_CompareInputForm>
                        {/* Right tab */}
                        <_CompareInputForm>
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
                        </_CompareInputForm>
                    </>
                )}
            </div>
        </div>
    )
}

export default _CompareTextInputForm
