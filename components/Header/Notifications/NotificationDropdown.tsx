import { Popover, Transition } from '@headlessui/react'
import { UilBell } from '@iconscout/react-unicons'
import React, { Fragment, useState } from 'react'
import { usePopper } from 'react-popper'

import { NotificationMenu } from './NotificationMenu'

export const NotificationDropdown: React.FC = () => {
    const [referenceElement, setReferenceElement] = useState(null)
    const [popperElement, setPopperElement] = useState(null)
    const { styles, attributes } = usePopper(referenceElement, popperElement)

    // Update popper location
    styles.popper = {
        position: 'absolute',
        right: '0',
        top: '1',
    }

    return (
        <Popover as="div">
            <Popover.Button
                className={
                    'inline-block relative mx-2 align-middle bg-neutral-50 dark:bg-neutralDark-50 rounded-full cursor-pointer md:w-12 md:h-12'
                }
                ref={setReferenceElement as unknown as string}
            >
                <UilBell
                    className={'my-2 mx-auto rotate-[25deg] fill-primary'}
                />
                <div className="inline-flex absolute top-2 right-1.5 w-2 h-2 bg-error dark:bg-errorDark rounded-full translate-x-1/2 -translate-y-1/2" />
            </Popover.Button>
            <Transition
                as={Fragment}
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-in"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
            >
                <Popover.Panel
                    as="div"
                    ref={setPopperElement as unknown as string}
                    style={styles.popper}
                    {...attributes.popper}
                >
                    <NotificationMenu />
                </Popover.Panel>
            </Transition>
        </Popover>
    )
}
