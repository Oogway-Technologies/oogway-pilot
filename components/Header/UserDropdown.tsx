import React from 'react'
import { Avatar } from '@mui/material'
import SettingsButton from './SettingsButton'
import ToggleTheme from './ToggleTheme'
import LogoutButton from './LogoutButton'
import DropdownMenu from '../Utils/DropdownMenu'
import { userDropdownClass } from '../../styles/header'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '../../firebase'
import { doc } from 'firebase/firestore'
import { useDocumentData } from 'react-firebase-hooks/firestore'

const UserDropdown: React.FC = () => {
    const [user] = useAuthState(auth)
    const [userProfile] = useDocumentData(doc(db, 'profiles', user.uid))

    // Dropdown menu props
    const menuButton = (
        <Avatar
            className={userDropdownClass.avatar}
            src={userProfile?.profilePic ? userProfile.profilePic : null}
        />
    )
    const menuItems = [
        <SettingsButton hasText={true} />,
        <LogoutButton hasText={true} />,
        <ToggleTheme hasText={true} />,
    ]

    return (
        <DropdownMenu
            menuButtonClass={userDropdownClass.menuButtonClass}
            menuItemsClass={userDropdownClass.menuItemsClass}
            menuButton={menuButton}
            menuItems={menuItems}
        />
    )
}

export default UserDropdown
