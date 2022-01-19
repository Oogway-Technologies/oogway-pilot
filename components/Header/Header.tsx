import Logo from "../Logo"
import Link from 'next/link'
import SearchBar from './SearchBar';
import AppsButton from './AppsButton';
import NavLinks from './NavLinks';
import UserDropdown from "./UserDropdown";
import ToggleTheme from "./ToggleTheme";

const Header = () => {
  return (
    <div className="shadow-sm shadow-black/10 dark:shadow-white/20">
        {/* Top: Toolbar */}
        <div 
        className='grid grid-cols-2 md:grid-cols-3 gap-y-2 grid-flow-row-dense w-full 
        py-5 px-3 justify-items-stretch items-center bg-white dark:bg-neutralDark-500'>
            {/* Left: Logo */}
            <div 
            className="flex items-center justify-self-start cursor-pointer md:mr-auto
            text-black dark:text-neutralDark-50">
                <Link href="/" passHref>
                    <a><Logo fill="currentColor"/></a>
                </Link>
            </div>
        
            {/* Center: Search */}
            <div 
            className="flex items-center justify-center col-span-2 md:col-span-1 md:justify-items-start">
                <SearchBar placeholder="What's your question?" />
            </div>
        
            {/* Right: User */}
            <div 
            className="flex space-x-2 items-center justify-self-end whitespace-nowrap px-1 md:ml-auto
            text-neutral-700 dark:text-neutralDark-150">
                {/* Uncomment Apps when we have hook */}
                {/* <AppsButton /> */}
                <UserDropdown />
            </div>
        </div>

        {/* Bottom: Slug */}
        <div className="flex w-full items-center justify-center bg-white dark:bg-neutralDark-500 px-3">
            <NavLinks listStyle="inline-flex"/>
        </div>

    </div>
  );
};

export default Header;
