import Head from 'next/head'
import { useState } from 'react'

import AuthenticationAPI from '../components/Login/AuthenticationAPI'
import Modal from '../components/Utils/Modal'

function Login() {
    const [isOpen, setIsOpen] = useState(true)

    // Modal helper functions
    const closeModal = () => {
        setIsOpen(false)
    }

    return (
        <div>
            <Head>
                <title>Login</title>
            </Head>
            <Modal show={isOpen} onClose={closeModal}>
                <AuthenticationAPI closeModal={closeModal} />
            </Modal>
        </div>
    )
}

export default Login
