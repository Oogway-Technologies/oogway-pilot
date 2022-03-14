import FocusTrap from 'focus-trap-react'
import React, { ReactNode, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'

import { modal } from '../../styles/utils'

type ModalProps = {
    children: ReactNode
    show: boolean
    onClose: () => void
}

const Modal: React.FC<ModalProps> = ({ children: content, show, onClose }) => {
    const [isBrowser, setIsBrowser] = useState(false)

    // create ref for the StyledModalWrapper component
    const modalWrapperRef = useRef<HTMLDivElement>(null)

    // check if the user has clickedinside or outside the modal
    const backDropHandler = (e: any) => {
        if (!modalWrapperRef?.current?.contains(e.target)) {
            // Why is onClose not working?
            onClose()
            console.log('closing')
        }
    }

    // Only search for modal component when mounted
    useEffect(() => {
        setIsBrowser(true)

        // attach event listener to the whole windor with our handler
        window.addEventListener('mousedown', backDropHandler)

        // // remove the event listener when the modal is closed
        return () => window.removeEventListener('mousedown', backDropHandler)
    }, [modalWrapperRef, setIsBrowser])

    /* This element tricks modal into centering */
    const centerModal = (
        <span className={modal.center} aria-hidden="true">
            &#8203;
        </span>
    )

    const modalContent = show ? (
        <div className={modal.overlay}>
            <FocusTrap active={show}>
                <div
                    className={modal.wrapper}
                    aria-modal="true"
                    ref={modalWrapperRef}
                >
                    <div className={modal.container}>
                        {centerModal}
                        <div className={modal.content}>{content}</div>
                    </div>
                </div>
            </FocusTrap>
        </div>
    ) : null

    // Render only for mounted app
    if (isBrowser) {
        return ReactDOM.createPortal(
            modalContent,
            document.getElementById('modal') as HTMLElement
        )
    } else {
        return null
    }
}

// {
//     return (
//         <Transition appear show={show} as={Fragment}>
//             <Dialog as="div" onClose={onClose}>
//                 <div className="flex justify-center px-4 w-11/12 text-center sm:w-full">
//                     <Transition.Child
//                         as={Fragment}
//                         enter="ease-out duration-300"
//                         enterFrom="opacity-0"
//                         enterTo="opacity-100"
//                         leave="ease-in duration-200"
//                         leaveFrom="opacity-100"
//                         leaveTo="opacity-0"
//                     >
//                         <Dialog.Overlay className="fixed inset-0 bg-neutralDark-300/75" />
//                     </Transition.Child>

//                     {/* This element is to trick the browser into centering the modal contents. */}
//                     <span
//                         className="inline-block align-middle"
//                         aria-hidden="true"
//                     >
//                         &#8203;
//                     </span>
//                     <Transition.Child
//                         as={Fragment}
//                         enter="ease-out duration-300"
//                         enterFrom="opacity-0 scale-95"
//                         enterTo="opacity-100 scale-100"
//                         leave="ease-in duration-200"
//                         leaveFrom="opacity-100 scale-100"
//                         leaveTo="opacity-0 scale-95"
//                     >
//                         <div
//                             className={
//                                 'overflow-hidden justify-center items-center p-6 my-8 max-w-6xl text-left' +
//                                 'bg-white dark:bg-neutralDark-500 rounded-2xl shadow-xl transition-all'
//                             }
//                         >
//                             {content}
//                         </div>
//                     </Transition.Child>
//                 </div>
//             </Dialog>
//         </Transition>
//     )
// }

export default Modal
