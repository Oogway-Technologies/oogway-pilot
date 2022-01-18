import ToggleTheme from "./ToggleTheme";
import { Avatar } from "@mui/material";
import { auth } from "../../firebase";
import Logo from "../Logo"
import Link from 'next/link'
import SearchBar from './SearchBar';
import SettingsButton from './SettingsButton'
import AppsButton from './AppsButton';

const Header = () => {
  return (
    <div 
    className='grid grid-cols-2 md:grid-cols-3 gap-y-2 grid-flow-row-dense w-full 
    py-5 px-3 justify-items-stretch items-center bg-white dark:bg-neutralDark-500'>
      
      {/* Left: Logo */}
        <div 
        className="flex items-center justify-self-start cursor-pointer md:mr-auto
        text-black dark:text-neutralDark-50">
            <Link href="/">
                <Logo fill="currentColor"/>
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
            <SettingsButton />
            <AppsButton />
            <Avatar
            className='hover:opacity-80 cursor-pointer'
            src={"https://cdn-icons-png.flaticon.com/512/2395/2395608.png"}
            onClick={() => auth.signOut()}/>
            <ToggleTheme />
        </div>
      
    </div>
  );
};

export default Header;
