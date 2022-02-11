import React, { useState } from 'react'
import { Avatar } from '@mui/material'
import SettingsButton from './SettingsButton'
import ToggleTheme from './ToggleTheme'
import LogoutButton from './LogoutButton'
import DropdownMenu from '../Utils/DropdownMenu'
import { userDropdownClass } from '../../styles/header'
import { useAuthState } from 'react-firebase-hooks/auth'
import { doc } from 'firebase/firestore'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import Modal from '../../components/Utils/Modal'
import UserProfileForm from '../Login/UserProfileForm'

// JSX and styling
import Button from '../Utils/Button'
import { loginButtons } from '../../styles/login'

// Auth0
import { useUser } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router'

// Recoil state
import { userProfileState } from '../../atoms/user'
import { useRecoilValue } from 'recoil'

const UserDropdown: React.FC = () => {
    const router = useRouter();
    const { user, isLoading } = useUser();
    const userProfile = useRecoilValue(userProfileState)

    // Navigate to user settings
    const goToUserSettings = () => {
        router.push(`/settings/${userProfile.uid}`)
    }

    const signIn = () => {
        router.push("/api/auth/login");
    }

    // Dropdown menu props
    // TODO: use user profile image (if exists) from recoil state
    const menuButton = (
        <Avatar
            className={userDropdownClass.avatar}
            src={userProfile ? userProfile.profilePic : (user ? user.picture : null)}
        />
    )
    
    const menuItems = [
        <SettingsButton hasText={true} onClick={goToUserSettings} />,
        <LogoutButton hasText={true} />,
        <ToggleTheme hasText={true} />,
    ]

    //<button className="" onClick={signIn}>
    //    Sign In
    //</button>

    return (
        (!isLoading && !user) ? (
            <Button
                onClick={signIn}
                addStyle={loginButtons.loginButtonWFullStyle}
                text="Sign In"
                keepText={true}
                icon={null}
                type="button"
            />
        ) : (
            <DropdownMenu
                menuButtonClass={userDropdownClass.menuButtonClass}
                menuItemsClass={userDropdownClass.menuItemsClass}
                menuButton={menuButton}
                menuItems={menuItems}
            />
        )
    )
}

export default UserDropdown
