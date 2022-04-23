import { UilSignOutAlt } from '@iconscout/react-unicons'
import { useRouter } from 'next/router'
import React from 'react'

import { auth } from '../../../firebase'
import { userDropDownButtonClass } from '../../../styles/header'

interface LogoutButtonProps {
    hasText: boolean
}

const LogoutButton: React.FC<
    React.PropsWithChildren<React.PropsWithChildren<LogoutButtonProps>>
> = ({ hasText }) => {
    // Router
    const router = useRouter()

    const logout = () => {
        auth.signOut()
        router.push('/api/auth/logout')
    }

    return (
        <a className={userDropDownButtonClass.a} onClick={logout}>
            <UilSignOutAlt className={userDropDownButtonClass.icon} />
            {hasText && 'Logout'}
        </a>
    )
}

LogoutButton.defaultProps = {
    hasText: false,
}

export default LogoutButton
