import Logo from '../Logo'
import Link from 'next/link'
import NavLinks from './NavLinks'
import UserDropdown from './UserDropdown'
import { headerClass } from '../../styles/header'
import { useRecoilValue } from 'recoil'
import { userProfileState } from '../../atoms/user'
import { useUser } from '@auth0/nextjs-auth0'

const Header = () => {
    // Call UserProfile to pass uid into links
    const { user, isLoading } = useUser()
    const userProfile = useRecoilValue(userProfileState)
    let links = [
        // TODO: Add as pages created
        // {
        //     href: ['/#'], // change to /Search when search page created
        //     text: 'Search',
        // },
        {
            href: ['/'],
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
                    {/*TODO: uncomment search bar when its done. */}
                    {/*<SearchBar placeholder="What's your question?"/>*/}
                </div>

                {/* Right: User */}
                <div className={headerClass.user}>
                    {/* Uncomment Apps when we have hook */}
                    {/* <AppsButton /> */}
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
