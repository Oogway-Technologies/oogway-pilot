import ToggleTheme from "./Theme/ToggleTheme";
import { Avatar } from "@mui/material";
import { auth } from "../firebase";

const Header = () => {
  return (
    <div className='flex items-center p-[5px]'>
      <ToggleTheme />
      <Avatar
        className='hover:opacity-80 cursor-pointer'
        src={"https://cdn-icons-png.flaticon.com/512/2395/2395608.png"}
        onClick={() => auth.signOut()}
      />
      <h1 className='ml-[10px] text-primary dark:text-white'>
        Click on the avatar to sign out
      </h1>
    </div>
  );
};

export default Header;
