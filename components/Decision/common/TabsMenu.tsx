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
            className={'relative ml-auto flex w-full items-start justify-end'}
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
                                'custom-box-shadow dark:custom-box-shadow-dark absolute top-9 z-10 w-48 space-y-1 rounded-2xl bg-white p-2 dark:bg-neutralDark-300'
                            }
                        >
                            {!isAI && (
                                <Menu.Item
                                    onClick={onClickFirst}
                                    as="section"
                                    className={`flex cursor-pointer items-center rounded-lg py-2 pr-1 hover:bg-neutral-50 dark:hover:bg-primaryDark/80`}
                                >
                                    <UilPen
                                        className={
                                            'mx-1 h-4 w-4 fill-neutral-700 dark:fill-white'
                                        }
                                    />
                                    <span
                                        className={`${bodySmallHeavy} font-normal text-neutral-700 dark:text-white`}
                                    >
                                        {firstItemText}
                                    </span>
                                </Menu.Item>
                            )}
                            <Menu.Item
                                onClick={onClickSecond}
                                as="section"
                                className={`flex cursor-pointer items-center rounded-lg py-2 pr-1 hover:bg-neutral-50 dark:hover:bg-primaryDark/80`}
                            >
                                <UilTrashAlt
                                    className={
                                        'mx-1 h-4 w-4 fill-neutral-700 dark:fill-white'
                                    }
                                />
                                <span
                                    className={`${bodySmallHeavy} font-normal text-neutral-700 dark:text-white`}
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
