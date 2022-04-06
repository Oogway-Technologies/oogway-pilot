import { UilSignOutAlt } from '@iconscout/react-unicons'
import { useRouter } from 'next/router'
import React from 'react'

import { auth } from '../../services/firebase'
import { logoutButtonClass } from '../../styles/header'

interface LogoutButtonProps {
    hasText: boolean
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ hasText }) => {
    // Router
    const router = useRouter()

    const logout = () => {
        auth.signOut()
        router.push('/api/auth/logout')
    }

    return (
        <a className={logoutButtonClass.a} onClick={logout}>
            <UilSignOutAlt className={logoutButtonClass.icon} />
            {hasText && 'Logout'}
        </a>
    )
}

LogoutButton.defaultProps = {
    hasText: false,
}

export default LogoutButton
