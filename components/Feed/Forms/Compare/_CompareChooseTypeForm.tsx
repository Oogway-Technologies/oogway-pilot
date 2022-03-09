import Reactvh from 'react'

// Styles and JSX
import { compareFormClass } from '../../../../styles/feed'
// @ts-ignore
import {
    UilTextFields,
    UilImageUpload,
    UilCancel,
    // @ts-ignore
} from '@iconscout/react-unicons'
import { useSetRecoilState } from 'recoil'
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

const _CompareChooseTypeForm = () => {
    // Update step
    const setCompareType = useSetRecoilState(comparePostType)
    const goToTextForm = () => {
        setCompareType('textOnly')
    }
    const goToImageForm = () => {
        setCompareType('imageOnly')
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
                        onClick={() => {
                            setHasPreviewed(false)
                            setExpanded(false)
                            setTextToCompareLeft('')
                            setTextToCompareRight('')
                            setImageToCompareLeft('')
                            setImageToCompareRight('')
                            setLabelToCompareLeft('')
                            setLabelToCompareRight('')
                        }}
                    >
                        <UilCancel size="30" />
                    </button>
                </div>
            </div>
            <div className={compareFormClass.optionsSideBySide}>
                <button className={compareFormClass.tab} onClick={goToTextForm}>
                    <div className={compareFormClass.chooseTypeLabel}>
                        <UilTextFields
                            className={compareFormClass.chooseTypeChild}
                            size={isMobile ? '30' : '60'}
                        />
                        <div className={compareFormClass.chooseTypeChild}>
                            Text
                        </div>
                    </div>
                </button>
                <button
                    className={compareFormClass.tab}
                    onClick={goToImageForm}
                >
                    <div className={compareFormClass.chooseTypeLabel}>
                        <UilImageUpload
                            className={compareFormClass.chooseTypeChild}
                            size={isMobile ? '30' : '60'}
                        />
                        <div className={compareFormClass.chooseTypeChild}>
                            Image
                        </div>
                    </div>
                </button>
            </div>
        </div>
    )
}

export default _CompareChooseTypeForm
