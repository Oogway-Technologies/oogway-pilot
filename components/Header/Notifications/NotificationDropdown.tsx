import { Popover, Transition } from '@headlessui/react'
import { UilBell } from '@iconscout/react-unicons'
import React, { Fragment, useState } from 'react'
import { usePopper } from 'react-popper'
import { useRecoilValue } from 'recoil'

import { userProfileState } from '../../../atoms/user'
import { useHasNotifications } from '../../../hooks/useHasNotifications'
import { NotificationMenu } from './NotificationMenu'
import { NotificationDropdownStyles } from './NotificationStyles'

export const NotificationDropdown: React.FC = () => {
    const [referenceElement, setReferenceElement] = useState(null)
    const [popperElement, setPopperElement] = useState(null)
    const { styles, attributes } = usePopper(referenceElement, popperElement)

    // Track notifications state
    const userProfile = useRecoilValue(userProfileState)
    const [hasNewNotifications] = useHasNotifications(userProfile.uid)

    // Update popper location
    styles.popper = {
        position: 'absolute',
        right: '0',
        top: '1',
    }

    return (
        <Popover as="div">
            <Popover.Button
                className={NotificationDropdownStyles.button}
                ref={setReferenceElement as unknown as string}
            >
                <UilBell className={NotificationDropdownStyles.bellIcon} />
                {hasNewNotifications && (
                    <div className={NotificationDropdownStyles.dot} />
                )}
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
                    {({ close }) => <NotificationMenu close={close} />}
                </Popover.Panel>
            </Transition>
        </Popover>
    )
}
