// Auth0
import { useUser } from '@auth0/nextjs-auth0'
// JSX and styling
import { useRouter } from 'next/router'
import React from 'react'
import { useRecoilValue } from 'recoil'

// Recoil state
import { userProfileState } from '../../atoms/user'
import { userDropdownClass } from '../../styles/header'
import { loginButtons } from '../../styles/login'
import Button from '../Utils/Button'
import { Avatar } from '../Utils/common/Avatar'
import DropdownMenu from '../Utils/DropdownMenu'
import LogoutButton from './LogoutButton'
import ProfileButton from './ProfileButton'
import ToggleTheme from './ToggleTheme'

// User profile

const UserDropdown: React.FC = () => {
    const router = useRouter()
    const { user, isLoading } = useUser()
    const userProfile = useRecoilValue(userProfileState)

    // Listen to userProfile rather than using static values from recoil
    // Why? Recoil only updates state on refreshes so when the user first
    // const [authorProfile] = useProfileData(userProfile.uid)

    // Navigate to user settings
    // TODO: Implement page
    // const goToUserSettings = () => {
    //     router.push(`/settings/${userProfile.uid}`)
    // }

    const signIn = () => {
        router.push('/api/auth/login')
    }

    // Dropdown menu props
    // TODO: use user profile image (if exists) from recoil state
    const menuButton = (
        <Avatar
            className={userDropdownClass.avatar}
            src={userProfile?.profilePic || user?.picture || ''}
        />
    )

    {
        /* TODO: uncomment settings when its done. */
    }
    const menuItems = [
        <ProfileButton
            key={'ProfileButton'}
            hasText={true}
            uid={userProfile?.uid}
        />,
        // <SettingsButton hasText={true} onClick={needsHook}/>,
        <LogoutButton key={'LogoutButton'} hasText={true} />,
        <ToggleTheme key={'ToggleTheme'} hasText={true} />,
    ]

    // <button className="" onClick={signIn}>
    //    Sign In
    // </button>

    return !isLoading && !user ? (
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
}

export default UserDropdown
