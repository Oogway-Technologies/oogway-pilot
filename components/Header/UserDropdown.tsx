import React from 'react'
import { Avatar } from '@mui/material'
import SettingsButton from './SettingsButton';
import ToggleTheme from './ToggleTheme';
import LogoutButton from './LogoutButton';
import DropdownMenu from '../Utils/DropdownMenu';
import { userDropdownClass } from '../../styles/header'

const UserDropdown: React.FC = () => {
    // Dropdown menu props
    const menuButton = <Avatar
        className={userDropdownClass.avatar}
        src={"https://cdn-icons-png.flaticon.com/512/2395/2395608.png"}/>
    const menuItems = [
        <SettingsButton hasText={true}/>,
        <LogoutButton hasText={true}/>,
        <ToggleTheme hasText={true}/>
    ]

    return <DropdownMenu 
                menuButtonClass={userDropdownClass.menuButtonClass}
                menuItemsClass={userDropdownClass.menuItemsClass}
                menuButton={menuButton}
                menuItems={menuItems}
            />
}

export default UserDropdown
