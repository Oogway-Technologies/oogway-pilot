import { UilUser } from '@iconscout/react-unicons'
import { useRouter } from 'next/router'
import React, { FC } from 'react'

import { userDropDownButtonClass } from '../../../styles/header'

interface ProfileButtonProps {
    hasText: boolean
    uid: string
}

const ProfileButton: FC<ProfileButtonProps> = ({ hasText, uid }) => {
    // Router
    const router = useRouter()

    const handleOnClick = async () => {
        if (uid) {
            router.push(`/profile/${uid}`)
        }
    }
    return (
        <a className={userDropDownButtonClass.a} onClick={handleOnClick}>
            <UilUser className={userDropDownButtonClass.icon} />
            {hasText && 'My Profile'}
        </a>
    )
}

export default ProfileButton
