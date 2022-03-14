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
                    onClick={() => onClose()}
                >
                    <div
                        className={modal.container}
                        onClick={e => e.stopPropagation()}
                    >
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

export default Modal
