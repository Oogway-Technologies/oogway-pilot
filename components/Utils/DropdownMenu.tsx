import { Popover, Transition } from '@headlessui/react';
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
    <Popover as="div" >
        <Popover.Button className={menuButtonClass}>{menuButton}</Popover.Button>
        <Transition
        as={Fragment}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-in"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
        >
            <Popover.Panel as="ul" className={menuItemsClass}>
            {menuItems.map(
                    (item, idx) => {
                        return (
                            <li key={idx} className="pt-1 group">
                                {item}
                            </li>
                        )
                    }
                )}
            </Popover.Panel>
        </Transition>
    </Popover>
  );
};

export default DropdownMenu;
