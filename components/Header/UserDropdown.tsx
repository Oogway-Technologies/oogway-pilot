import React, { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { Avatar } from '@mui/material'
import SettingsButton from './SettingsButton';
import ToggleTheme from './ToggleTheme';
import LogoutButton from './LogoutButton';

interface UserDropdownProps {
    
}

const UserDropdown: React.FC = (props: UserDropdownProps) => {
    const menuButtonClass: string = "inline-flex font-medium bg-transparent"
    const menuItemsClass: string = "absolute right-6 w-48 h-auto mt-2 p-2 origin-top-right \
        bg-white dark:bg-neutralDark-500 divide-y divide-neutral-300 dark:divide-neutralDark-300 rounded-md shadow-lg \
        ring-2 ring-primary dark:ring-white ring-opacity-50 focus:outline-none"

    return (
        <Menu as="div" >
            <Menu.Button className={menuButtonClass}>
            <Avatar
            className='hover:opacity-80 hover:scale-125 md:h-12 md:w-12 cursor-pointer'
            src={"https://cdn-icons-png.flaticon.com/512/2395/2395608.png"}
            />
            </Menu.Button>
            <Transition
            as={Fragment}
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-in"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
            >
                <Menu.Items as="ul" className={menuItemsClass}>
                    <Menu.Item as="li" className="pt-1 group">
                        <SettingsButton hasText={true}/>
                    </Menu.Item>
                    <Menu.Item as="li" className="pt-1 group">
                        <LogoutButton hasText={true}/>
                    </Menu.Item>
                    <Menu.Item as="li" className="pt-1 group"> 
                        <ToggleTheme hasText={true}/>
                    </Menu.Item>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}

export default UserDropdown
