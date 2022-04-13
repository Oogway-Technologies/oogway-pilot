import { UilInfoCircle } from '@iconscout/react-unicons'
import React from 'react'

import { userDropDownButtonClass } from '../../../styles/header'

interface DisclaimerButtonProps {
    hasText: boolean
    setIsOpen: (b: boolean) => void
}

const DisclaimerButton: React.FC<DisclaimerButtonProps> = ({
    hasText,
    setIsOpen,
}) => {
    return (
        <a
            className={userDropDownButtonClass.a}
            onClick={() => setIsOpen(true)}
        >
            <UilInfoCircle className={userDropDownButtonClass.icon} />
            {hasText && 'Disclaimer'}
        </a>
    )
}

export default DisclaimerButton
