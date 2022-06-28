import { Menu, Transition } from '@headlessui/react'
import React, { Fragment } from 'react'

import { IV } from '../../../utils/types/global'

interface DropDownMenu {
    menuText: string // for added text to menu button
    menuEndIcon?: JSX.Element
    menuStartIcon?: JSX.Element
    onClickItem: (v?: IV) => void
    itemArray: string[]
    selectedItem?: string // to get highlighted effect on selected item
    menuClass?: string
    menuTextClass?: string
    menuItemsClass?: string
    menuItemClass?: string
}

export const DropDownMenu = ({
    menuText = '',
    menuEndIcon,
    menuStartIcon,
    onClickItem,
    itemArray,
    selectedItem = '',
    menuClass = '',
    menuTextClass = '',
    menuItemsClass = '',
    menuItemClass = '',
}: DropDownMenu) => {
    return (
        <Menu
            as="div"
            className={`relative ml-auto flex w-full items-start justify-end ${menuClass}`}
        >
            {({ open }) => (
                <>
                    <Menu.Button
                        className={`flex items-center space-x-3 ${menuTextClass}`}
                    >
                        {menuStartIcon}
                        <span>{menuText}</span>
                        {menuEndIcon}
                    </Menu.Button>
                    <Transition
                        as={Fragment}
                        show={open}
                        enter="transition duration-100 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-75 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                    >
                        <Menu.Items
                            className={`custom-box-shadow dark:custom-box-shadow-dark absolute top-6 flex flex-col rounded-lg bg-white px-2 py-1.5 dark:bg-neutralDark-500 md:px-4 md:py-3 ${menuItemsClass}`}
                        >
                            {itemArray.map((item, index) => (
                                <Menu.Item
                                    key={`menu-item-${item}-${index}`}
                                    onClick={() =>
                                        onClickItem({ index, value: item })
                                    }
                                    as="section"
                                    className={`${menuItemClass} ${
                                        selectedItem === item
                                            ? '!font-bold text-primary dark:text-primaryDark'
                                            : ''
                                    }`}
                                >
                                    {item}
                                </Menu.Item>
                            ))}
                        </Menu.Items>
                    </Transition>
                </>
            )}
        </Menu>
    )
}
