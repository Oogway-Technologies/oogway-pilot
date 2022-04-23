import { UilSetting } from '@iconscout/react-unicons'
import Link from 'next/link'
import { FC, MouseEventHandler } from 'react'

import { userDropDownButtonClass } from '../../../styles/header'

interface SettingsButtonProps {
    hasText: boolean
    onClick: MouseEventHandler<HTMLAnchorElement>
}

const SettingsButton: FC<
    React.PropsWithChildren<React.PropsWithChildren<SettingsButtonProps>>
> = ({ hasText, onClick }) => {
    return (
        <Link href="#" passHref>
            <a onClick={onClick} className={userDropDownButtonClass.a}>
                <UilSetting className={userDropDownButtonClass.icon} />
                {hasText && 'Settings'}
            </a>
        </Link>
    )
}

SettingsButton.defaultProps = {
    hasText: false,
}

export default SettingsButton
