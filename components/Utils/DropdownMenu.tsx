import { Menu, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';

type DropdownMenuProps = {
    menuButtonClass: string,
    menuItemsClass: string,
    menuButton: Any,
    menuItems: Array<T>
};

const DropdownMenu: React.FC<DropdownMenuProps> = (
    {
        menuButtonClass,
        menuItemsClass,
        menuButton,
        menuItems
    }
) => {
  return (
        <Menu as="div" >
        <Menu.Button className={menuButtonClass}>
            {menuButton}
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
                {menuItems.map(
                    (item, idx) => {
                        return (
                            <Menu.Item key={idx} as="li" className="pt-1 group">
                                {item}
                            </Menu.Item>
                        )
                    }
                )}
            </Menu.Items>
        </Transition>
    </Menu>
  );
};

export default DropdownMenu;
