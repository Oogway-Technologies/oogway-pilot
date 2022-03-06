import React, { FC } from 'react'
// @ts-ignore
import { UilUser } from '@iconscout/react-unicons'
import { useRouter } from 'next/router'
import { profileButtonClass } from '../../styles/header'

interface ProfileButtonProps {
    hasText: boolean
    uid: string
}

const ProfileButton: FC<ProfileButtonProps> = ({ hasText, uid }) => {
    // Router
    const router = useRouter()

    const handleOnClick = async () => {
        uid && router.push(`/profile/${uid}`)
    }
    return (
        <a className={profileButtonClass.a} onClick={handleOnClick}>
            <UilUser className={profileButtonClass.icon} />
            {hasText && 'My Profile'}
        </a>
    )
}

export default ProfileButton
