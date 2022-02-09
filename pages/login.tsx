import {useState} from 'react'
import Head from 'next/head'
import Modal from '../components/Utils/Modal'
import AuthenticationAPI from '../components/Login/AuthenticationAPI'

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
            <Modal
                children={<AuthenticationAPI closeModal={closeModal}/>}
                show={isOpen}
                onClose={closeModal}
            />
        </div>
    )
}

export default Login
