import { UilSetting } from '@iconscout/react-unicons'
import Link from 'next/link'
import { FC, MouseEventHandler } from 'react'

import { settingsButtonClass } from '../../styles/header'

interface SettingsButtonProps {
    hasText: boolean
    onClick: MouseEventHandler<HTMLAnchorElement>
}

const SettingsButton: FC<SettingsButtonProps> = ({ hasText, onClick }) => {
    return (
        <Link href="#" passHref>
            <a onClick={onClick} className={settingsButtonClass.a}>
                <UilSetting className={settingsButtonClass.icon} />
                {hasText && 'Settings'}
            </a>
        </Link>
    )
}

SettingsButton.defaultProps = {
    hasText: false,
}

export default SettingsButton
