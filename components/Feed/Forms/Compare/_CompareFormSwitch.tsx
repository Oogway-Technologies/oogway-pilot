import React, { ChangeEvent, FC, useState } from 'react'
import _CompareChooseTypeForm from './_CompareChooseTypeForm'
import _CompareImageInputForm from './_CompareImageInputForm'
import _CompareTextInputForm from './_CompareTextInputForm'
import { useRecoilValue } from 'recoil'
import { comparePostType } from '../../../../atoms/compareForm'
import { compareFilePickerRefs } from '../../../../utils/types/global'

interface _CompareStepSwitchProps {
    handleLeftUpload: (e: ChangeEvent<HTMLInputElement>) => void
    handleRightUpload: (e: ChangeEvent<HTMLInputElement>) => void
}

const _CompareStepSwitch = React.forwardRef<
    compareFilePickerRefs,
    _CompareStepSwitchProps
>(({ handleLeftUpload, handleRightUpload }, ref) => {
    // Fetch form step from atom
    const compareType = useRecoilValue(comparePostType)

    switch (compareType) {
        case 'chooseType':
            return <_CompareChooseTypeForm />
        case 'textOnly':
            return <_CompareTextInputForm />
        case 'imageOnly':
            return (
                <_CompareImageInputForm
                    ref={ref}
                    handleLeftUpload={handleLeftUpload}
                    handleRightUpload={handleRightUpload}
                />
            )
        default:
            return <_CompareChooseTypeForm />
    }
})

export default _CompareStepSwitch
