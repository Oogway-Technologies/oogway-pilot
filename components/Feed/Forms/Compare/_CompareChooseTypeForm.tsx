import Reactvh from 'react'

// Styles and JSX
import { compareFormClass } from '../../../../styles/feed'
// @ts-ignore
import { UilTextFields, UilImageUpload } from '@iconscout/react-unicons'
import { useSetRecoilState } from 'recoil'
import { comparePostType } from '../../../../atoms/compareForm'
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

    // Track mobile state
    const isMobile = useMediaQuery('(max-width: 500px)')

    return (
        <div className="flex flex-col">
            <div className={compareFormClass.header}>Select Compare Type</div>
            <div className={compareFormClass.optionsSideBySide}>
                <button className={compareFormClass.tab} onClick={goToTextForm}>
                    <div className={compareFormClass.chooseTypeLabel}>
                        <UilTextFields
                            className={compareFormClass.chooseTypeChild}
                            size={isMobile ? '30' : '60'}
                        />
                        <div className={compareFormClass.chooseTypeChild}>
                            Text Only
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
                            Image Only
                        </div>
                    </div>
                </button>
            </div>
        </div>
    )
}

export default _CompareChooseTypeForm
