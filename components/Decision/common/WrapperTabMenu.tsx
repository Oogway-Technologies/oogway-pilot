import { Menu, Transition } from '@headlessui/react'
import {
    UilEllipsisH,
    UilHistory,
    UilInfoCircle,
    UilPlusCircle,
} from '@iconscout/react-unicons'
import React, { FC, Fragment } from 'react'
import { useFormContext } from 'react-hook-form'

import {
    handleResetState,
    setDecisionHistoryModal,
    setInfoModal,
    setInfoModalDetails,
} from '../../../features/decision/decisionSlice'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { bodySmallHeavy } from '../../../styles/typography'
import { decisionInfo } from '../../../utils/constants/global'

interface WrapperTabMenuProps {
    title: string
}

export const WrapperTabMenu: FC<WrapperTabMenuProps> = ({
    title,
}: WrapperTabMenuProps) => {
    const { reset } = useFormContext()
    const { currentTab, decisionHistoryModal } = useAppSelector(
        state => state.decisionSlice
    )

    const handleReset = () => {
        reset()
        useAppDispatch(handleResetState())
    }

    const handleInfoClick = () => {
        useAppDispatch(
            setInfoModalDetails({
                title: title.replace('your ', ''),
                context: decisionInfo[currentTab],
            })
        )
        useAppDispatch(setInfoModal(true))
    }
    const handleHistory = () => {
        useAppDispatch(setDecisionHistoryModal(!decisionHistoryModal))
    }

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
                            <Menu.Item
                                onClick={() => handleHistory()}
                                as="section"
                                className={`flex cursor-pointer items-center rounded-lg py-2 pr-1 hover:bg-neutral-50 dark:hover:bg-primaryDark/80`}
                            >
                                <UilHistory
                                    className={
                                        'mx-1 h-4 w-4 fill-neutral-700 dark:fill-white'
                                    }
                                />
                                <span
                                    className={`${bodySmallHeavy} font-normal text-neutral-700 dark:text-white`}
                                >
                                    Decision History
                                </span>
                            </Menu.Item>

                            <Menu.Item
                                onClick={() => handleReset()}
                                as="section"
                                className={`flex cursor-pointer items-center rounded-lg py-2 pr-1 hover:bg-neutral-50 dark:hover:bg-primaryDark/80`}
                            >
                                <UilPlusCircle
                                    className={
                                        'mx-1 h-4 w-4 fill-neutral-700 dark:fill-white'
                                    }
                                />
                                <span
                                    className={`${bodySmallHeavy} font-normal text-neutral-700 dark:text-white`}
                                >
                                    New decision
                                </span>
                            </Menu.Item>
                            <Menu.Item
                                onClick={() => handleInfoClick()}
                                as="section"
                                className={`flex cursor-pointer items-center rounded-lg py-2 pr-1 hover:bg-neutral-50 dark:hover:bg-primaryDark/80`}
                            >
                                <UilInfoCircle
                                    className={
                                        'mx-1 h-4 w-4 fill-neutral-700 dark:fill-white'
                                    }
                                />
                                <span
                                    className={`${bodySmallHeavy} font-normal text-neutral-700 dark:text-white`}
                                >
                                    Explain
                                </span>
                            </Menu.Item>
                        </Menu.Items>
                    </Transition>
                </>
            )}
        </Menu>
    )
}
