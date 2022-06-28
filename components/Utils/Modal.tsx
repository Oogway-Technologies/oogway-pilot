import { Dialog, Transition } from '@headlessui/react'
import { UilTimesCircle } from '@iconscout/react-unicons'
import React, { Fragment, ReactNode } from 'react'

type ModalProps = {
    children: ReactNode
    show: boolean
    onClose: (value: boolean) => void
    closeIcon?: boolean
}

const Modal: React.FC<
    React.PropsWithChildren<React.PropsWithChildren<ModalProps>>
> = ({ children: content, show, onClose, closeIcon }) => {
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
                            className={
                                'max-h-[80vh] overflow-auto justify-center items-center p-6 my-8 max-w-6xl text-left' +
                                ' bg-white dark:bg-neutralDark-500 rounded-2xl shadow-xl transition-all z-10 sm:w-inherit scrollbar-hide'
                            }
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
