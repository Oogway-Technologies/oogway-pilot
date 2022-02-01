import React from 'react'
import { UilSetting } from '@iconscout/react-unicons'
import Link from 'next/link'
import { settingsButtonClass } from '../../styles/header'
import needsHook from '../../hooks/needsHook';

interface SettingsButtonProps {
    hasText: boolean
}

const SettingsButton: React.FC<SettingsButtonProps> = ({ hasText }) => {
    return (
        <Link href='#'  passHref>
            <a 
                onClick={needsHook}
                className={settingsButtonClass.a}>
                <UilSetting className={settingsButtonClass.icon}/>
            {hasText && 'Settings'}
            </a>
        </Link>
    )
}

SettingsButton.defaultProps = {
    hasText: false
}

export default SettingsButton
