import { useUser } from '@auth0/nextjs-auth0'
import Link from 'next/link'

import { useAppSelector } from '../../hooks/useRedux'
import { headerClass } from '../../styles/header'
import Logo from '../Logo'
import NavLinks from './NavLinks'
import { NotificationDropdown } from './Notifications/NotificationDropdown'
import UserDropdown from './UserDropdown'

const Header = () => {
    // Call UserProfile to pass uid into links
    const { user, isLoading } = useUser()
    const userProfile = useAppSelector(state => state.userSlice.user)
    const feed = useAppSelector(state => state.utilsSlice.feedState)
    let links = [
        // TODO: Add as pages created
        {
            href: ['/'],
            text: 'Decision Engine',
        },
        {
            href: ['/feed', `/feed/${feed}`],
            text: 'Feed',
        },
    ]
    const userOnlyLinks = [
        {
            href: [`/profile/${userProfile.uid}`],
            text: 'My Profile',
        },
        // {
        //     href: ['/#'], // change to Friends when created
        //     text: 'Friends',
        // },
    ]

    // Add auth-only components for logged in users
    if (!isLoading && user) {
        links = links.concat(userOnlyLinks)
    }

    return (
        <div className={headerClass.div}>
            {/* Top: Toolbar */}
            <div className={headerClass.toolbar}>
                {/* Left: Logo */}
                <div className={headerClass.logo}>
                    <Link href="/" passHref>
                        <a>
                            <Logo fill="currentColor" />
                        </a>
                    </Link>
                </div>

                {/* Center: Search */}
                <div className={headerClass.search}>
                    {/* TODO: uncomment search bar when its done. */}
                    {/* <SearchBar placeholder="What's your question?"/>*/}
                </div>

                {/* Right: User */}
                <div className={headerClass.user}>
                    {/* Uncomment Apps when we have hook */}
                    {/* <AppsButton /> */}
                    {user && <NotificationDropdown />}
                    <UserDropdown />
                </div>
            </div>

            {/* Bottom: Slug */}
            <div className={headerClass.slug}>
                <NavLinks links={links} listStyle={headerClass.slugList} />
            </div>
        </div>
    )
}

export default Header
