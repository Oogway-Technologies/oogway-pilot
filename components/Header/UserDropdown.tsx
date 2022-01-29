import React from 'react'
import { Avatar } from '@mui/material'
import SettingsButton from './SettingsButton';
import ToggleTheme from './ToggleTheme';
import LogoutButton from './LogoutButton';
import DropdownMenu from '../Utils/DropdownMenu';


// Styles
const UserDropdownStyles = {
    menuButtonClass: "inline-flex font-medium bg-transparent",
    menuItemsClass: "absolute right-6 w-48 h-auto mt-2 p-2 origin-top-right \
        bg-white dark:bg-neutralDark-500 divide-y divide-neutral-300 dark:divide-neutralDark-300 rounded-md shadow-lg \
        ring-2 ring-primary dark:ring-white ring-opacity-50 focus:outline-none"
}

const UserDropdown: React.FC = () => {
    // Dropdown menu props
    const menuButton = <Avatar
        className='hover:opacity-80 hover:scale-125 md:h-12 md:w-12 cursor-pointer'
        src={"https://cdn-icons-png.flaticon.com/512/2395/2395608.png"}/>
    const menuItems = [
        <SettingsButton hasText={true}/>,
        <LogoutButton hasText={true}/>,
        <ToggleTheme hasText={true}/>
    ]

    return <DropdownMenu 
                menuButtonClass={UserDropdownStyles.menuButtonClass}
                menuItemsClass={UserDropdownStyles.menuItemsClass}
                menuButton={menuButton}
                menuItems={menuItems}
            />
}

export default UserDropdown
