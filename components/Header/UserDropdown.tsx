// Auth0
import { useUser } from '@auth0/nextjs-auth0'
// JSX and styling
import { useRouter } from 'next/router'
import React, { useState } from 'react'

import useMediaQuery from '../../hooks/useMediaQuery'
import { useAppSelector } from '../../hooks/useRedux'
import { userDropdownClass } from '../../styles/header'
import { loginButtons } from '../../styles/login'
import { bodyHeavy } from '../../styles/typography'
import { defaultProfileImage } from '../../utils/constants/global'
import FeedDisclaimer from '../Feed/Sidebar/FeedDisclaimer'
import Button from '../Utils/Button'
import { Avatar } from '../Utils/common/Avatar'
import DropdownMenu from '../Utils/DropdownMenu'
import Modal from '../Utils/Modal'
import DisclaimerButton from './UserDropDownButtons/DisclaimerButton'
import LogoutButton from './UserDropDownButtons/LogoutButton'
import ProfileButton from './UserDropDownButtons/ProfileButton'
import ToggleTheme from './UserDropDownButtons/ToggleTheme'

// User profile

const UserDropdown: React.FC = () => {
    const router = useRouter()
    const { user, isLoading } = useUser()
    const userProfile = useAppSelector(state => state.userSlice.user)
    const [isOpen, setIsOpen] = useState(false)
    const isMobile = useMediaQuery('(max-width: 965px)')

    // Navigate to user settings
    // TODO: Implement page
    // const goToUserSettings = () => {
    //     router.push(`/settings/${userProfile.uid}`)
    // }

    const signIn = () => {
        router.push('/api/auth/login')
    }

    // Dropdown menu props
    const menuButton = (
        <Avatar
            className={userDropdownClass.avatar}
            src={
                userProfile?.profilePic
                    ? userProfile?.profilePic
                    : defaultProfileImage
            }
        />
    )

    {
        /* TODO: uncomment settings when its done. */
    }
    const menuItems = [
        <ProfileButton
            key={'ProfileButton'}
            hasText={true}
            uid={userProfile?.uid}
        />,
        // <SettingsButton hasText={true} onClick={needsHook}/>,
        <LogoutButton key={'LogoutButton'} hasText={true} />,
        <ToggleTheme key={'ToggleTheme'} hasText={true} />,
        isMobile ? (
            <DisclaimerButton
                key={'DisclaimerButton'}
                hasText={true}
                setIsOpen={setIsOpen}
            />
        ) : (
            <></>
        ),
    ]

    // <button className="" onClick={signIn}>
    //    Sign In
    // </button>

    return (
        <>
            {!isLoading && !user ? (
                <Button
                    onClick={signIn}
                    addStyle={loginButtons.loginButtonWFullStyle}
                    text="Sign In"
                    keepText={true}
                    icon={null}
                    type="button"
                />
            ) : (
                <DropdownMenu
                    menuButtonClass={userDropdownClass.menuButtonClass}
                    menuItemsClass={userDropdownClass.menuItemsClass}
                    menuButton={menuButton}
                    menuItems={menuItems}
                />
            )}
            <Modal
                closeIcon={true}
                onClose={() => setIsOpen(false)}
                show={isOpen}
            >
                <div className="flex flex-col justify-start">
                    <span className={bodyHeavy}>Disclaimer</span>
                    <FeedDisclaimer />
                </div>
            </Modal>
        </>
    )
}

export default UserDropdown
