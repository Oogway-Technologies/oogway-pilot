import React from 'react'
import { auth } from '../../firebase'
import { UilSignOutAlt } from '@iconscout/react-unicons'

interface LogoutButtonProps {
    hasText: boolean
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ hasText }) => {
    return (
        <a 
        className="inline-flex group-hover:text-black active:text-black dark:group-hover:text-neutralDark-50 
        dark:active:text-neutralDark-50 cursor-pointer" 
        onClick={() => auth.signOut()}>
            <UilSignOutAlt className="mx-1"/> 
            {hasText && 'Logout'}
        </a>
    )
}

LogoutButton.defaultProps = {
    hasText: false
}

export default LogoutButton
