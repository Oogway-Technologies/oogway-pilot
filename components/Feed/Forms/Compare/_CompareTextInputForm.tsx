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
import preventDefaultOnEnter from '../../../../utils/helpers/preventDefaultOnEnter'
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
        <div className="flex flex-col">
            <div className={compareFormClass.header}>
                <Tooltip toolTipText={'Go Back'}>
                    <button
                        className={compareFormClass.goBackButton}
                        onClick={() => {
                            goToChooseType()
                            setTextToCompareLeft('')
                            setTextToCompareRight('')
                        }}
                    >
                        <UilAngleLeft />
                    </button>
                </Tooltip>
                Text Only
            </div>
            {/* <div className={compareFormClass.smallGreyText + ' ml-xl'}>
                Text Only
            </div> */}
            <div className={compareFormClass.optionsSideBySide}>
                {/* Left Tab */}
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
                        <_CompareInputForm title="First Option">
                            <div className={compareFormClass.textInputDiv}>
                                <textarea
                                    className={compareFormClass.textInput}
                                    placeholder="Label your first option"
                                    onKeyPress={preventDefaultOnEnter}
                                    onChange={e => {
                                        setTextToCompareLeft(e.target.value)
                                    }}
                                    value={textToCompareLeft}
                                    maxLength={shortLimit}
                                />
                            </div>
                        </_CompareInputForm>
                        {/* Right tab */}
                        <_CompareInputForm title="Second Option">
                            <div className={compareFormClass.textInputDiv}>
                                <textarea
                                    className={compareFormClass.textInput}
                                    placeholder="Label your second option"
                                    onKeyPress={preventDefaultOnEnter}
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
