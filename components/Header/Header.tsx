import Logo from '../Logo'
import Link from 'next/link'
import SearchBar from './SearchBar'
import AppsButton from './AppsButton'
import NavLinks from './NavLinks'
import UserDropdown from './UserDropdown'
import { headerClass } from '../../styles/header'
import { useRecoilValue } from 'recoil'
import { userProfileState } from '../../atoms/user'

const Header = () => {
    // Call UserProfile to pass uid into links
    const userProfile = useRecoilValue(userProfileState)
    const links = [
        // TODO: Add as pages created
        {
            href: ['/#'], // change to /Search when search page created
            text: 'Search',
        },
        {
            href: ['/'],
            text: 'Feed',
        },
        {
            href: ['/#'], // change to Friends when created
            text: 'Friends',
        },
    ]

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
                    <SearchBar placeholder="What's your question?" />
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
