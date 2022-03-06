import { Popover, Transition } from '@headlessui/react'
import React, { FC, Fragment, useState } from 'react'
import { usePopper } from 'react-popper'

type DropdownMenuProps = {
    menuButtonClass: string
    menuItemsClass: string
    menuButton: JSX.Element
    menuItems: JSX.Element[]
}

const DropdownMenu: FC<DropdownMenuProps> = ({
    menuButtonClass,
    menuItemsClass,
    menuButton,
    menuItems,
}) => {
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
                className={menuButtonClass}
                ref={setReferenceElement as unknown as string}
            >
                {menuButton}
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
                    as="ul"
                    className={menuItemsClass}
                    ref={setPopperElement as unknown as string}
                    style={styles.popper}
                    {...attributes.popper}
                >
                    {({ close }) =>
                        menuItems.map((item, idx) => {
                            return (
                                <li
                                    key={idx}
                                    className="pt-1 group"
                                    onClick={() => close()}
                                >
                                    {item}
                                </li>
                            )
                        })
                    }
                </Popover.Panel>
            </Transition>
        </Popover>
    )
}

export default DropdownMenu
