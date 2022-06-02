import { Menu, Transition } from '@headlessui/react'
import { UilEllipsisH, UilPen, UilTrashAlt } from '@iconscout/react-unicons'
import React, { Fragment } from 'react'

import { bodySmallHeavy } from '../../../styles/typography'

interface TabsMenu {
    firstItemText: string
    secondItemText: string
    onClickFirst: () => void
    onClickSecond: () => void
    isAI?: boolean
}

export const TabsMenu = ({
    firstItemText,
    secondItemText,
    onClickFirst,
    onClickSecond,
    isAI = false,
}: TabsMenu) => {
    return (
        <Menu
            as="div"
            className={'flex relative justify-end items-start ml-auto w-full'}
        >
            {({ open }) => (
                <>
                    <Menu.Button
                        className={`p-1 ${
                            open
                                ? 'rounded-full bg-neutral-50 dark:bg-primaryDark/80'
                                : ''
                        }`}
                    >
                        <UilEllipsisH
                            className={'fill-neutral-700 dark:fill-white'}
                        />
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
                            className={
                                'absolute top-9 z-10 p-2 space-y-1 w-48 bg-white dark:bg-neutralDark-300 rounded-2xl custom-box-shadow dark:custom-box-shadow-dark'
                            }
                        >
                            {!isAI && (
                                <Menu.Item
                                    onClick={onClickFirst}
                                    as="section"
                                    className={`flex items-center py-2 cursor-pointer rounded-lg hover:bg-neutral-50 dark:hover:bg-primaryDark/80 pr-1`}
                                >
                                    <UilPen
                                        className={
                                            'mx-1 w-4 h-4 fill-neutral-700 dark:fill-white'
                                        }
                                    />
                                    <span
                                        className={`${bodySmallHeavy} text-neutral-700 dark:text-white font-normal`}
                                    >
                                        {firstItemText}
                                    </span>
                                </Menu.Item>
                            )}
                            <Menu.Item
                                onClick={onClickSecond}
                                as="section"
                                className={`flex items-center py-2 cursor-pointer rounded-lg hover:bg-neutral-50 dark:hover:bg-primaryDark/80 pr-1`}
                            >
                                <UilTrashAlt
                                    className={
                                        'mx-1 w-4 h-4 fill-neutral-700 dark:fill-white'
                                    }
                                />
                                <span
                                    className={`${bodySmallHeavy} text-neutral-700 dark:text-white font-normal`}
                                >
                                    {secondItemText}
                                </span>
                            </Menu.Item>
                        </Menu.Items>
                    </Transition>
                </>
            )}
        </Menu>
    )
}
