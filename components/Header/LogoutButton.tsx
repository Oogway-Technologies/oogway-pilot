import React from 'react'
import { auth } from '../../firebase'
import { UilSignOutAlt } from '@iconscout/react-unicons'
import { logoutButtonClass } from '../../styles/header'

interface LogoutButtonProps {
    hasText: boolean
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ hasText }) => {
    return (
        <a 
        className={logoutButtonClass.a}
        onClick={() => auth.signOut()}>
            <UilSignOutAlt className={logoutButtonClass.icon}/> 
            {hasText && 'Logout'}
        </a>
    )
}

LogoutButton.defaultProps = {
    hasText: false
}

export default LogoutButton
