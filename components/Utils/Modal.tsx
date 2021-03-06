import { Dialog, Transition } from '@headlessui/react'
import { UilTimesCircle } from '@iconscout/react-unicons'
import React, { Fragment, ReactNode } from 'react'

type ModalProps = {
    children: ReactNode
    show: boolean
    onClose: (value: boolean) => void
    closeIcon?: boolean
    className?: string
}

const Modal: React.FC<
    React.PropsWithChildren<React.PropsWithChildren<ModalProps>>
> = ({ children: content, show, onClose, closeIcon, className = '' }) => {
    return (
        <Transition appear show={show} as={Fragment}>
            <Dialog
                className="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto"
                as="div"
                onClose={onClose}
            >
                <div className="flex w-11/12 justify-center px-4 text-center sm:w-full">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-neutralDark-300/75" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span
                        className="inline-block align-middle"
                        aria-hidden="true"
                    >
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div
                            className={`sm:w-inherit z-10 my-8 max-h-[80vh] max-w-6xl items-center justify-center overflow-auto rounded-2xl bg-white p-6 text-left shadow-xl transition-all scrollbar-hide dark:bg-neutralDark-500 ${className}`}
                        >
                            {closeIcon && (
                                <UilTimesCircle
                                    className={'mb-2 ml-auto cursor-pointer'}
                                    onClick={() => onClose(false)}
                                />
                            )}
                            {content}
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    )
}

export default Modal
