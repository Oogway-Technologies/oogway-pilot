import Logo from "../Logo"
import Link from 'next/link'
import SearchBar from './SearchBar';
import AppsButton from './AppsButton';
import NavLinks from './NavLinks';
import UserDropdown from "./UserDropdown";
import { headerClass } from '../../styles/header';

const Header = () => {
  return (
    <div className={headerClass.div}>
        {/* Top: Toolbar */}
        <div className={headerClass.toolbar}>
            {/* Left: Logo */}
            <div className={headerClass.logo}>
                <Link href="/" passHref>
                    <a><Logo fill="currentColor"/></a>
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
            <NavLinks listStyle={headerClass.slugList}/>
        </div>

    </div>
  );
};

export default Header;
