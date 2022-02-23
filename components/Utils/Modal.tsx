import {Dialog, Transition} from '@headlessui/react';
import React, {Fragment, ReactNode} from 'react';
// @ts-ignore
import {UilTimes} from '@iconscout/react-unicons'

type ModalProps = {
    children: ReactNode,
    show: boolean,
    onClose: ((value?: boolean) => void)
    closeIcon?: boolean
};

const Modal: React.FC<ModalProps> = ({children: content, show, onClose, closeIcon = false}) => {
    return (
        <Transition appear show={show} as={Fragment}>
            <Dialog
                className="fixed inset-0 z-10 overflow-y-auto flex justify-center items-center"
                as="div"
                onClose={onClose}
            >
                <div className="flex w-11/12 sm:w-full justify-center px-4 text-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-neutralDark-300/75"/>
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
                        <div className="justify-center items-center max-w-6xl p-6 my-8 overflow-hidden text-left
                        transition-all transform bg-white dark:bg-neutralDark-500 shadow-xl rounded-2xl">
                            {closeIcon && <UilTimes className={'ml-auto cursor-pointer'} onClick={() => onClose()}/>}
                            {content}
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};

export default Modal;
