import { useState, useEffect } from 'react';

import { Switch } from '@headlessui/react';
import { Sun, Moon } from 'react-feather';
import { useTheme } from 'next-themes';


const ToggleTheme = () => {
    const [enabled, setEnabled] = useState(false)
    const {theme, setTheme} = useTheme()

    // Maintain state on (re)mount
    useEffect(() => {
        theme === 'light' ? setEnabled(false) : setEnabled(true);
    }, [])

    // Helper function to 
    const handleChangeTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light')
        setEnabled(!enabled)
    }

    return (
        <Switch
        checked={enabled}
        onChange={handleChangeTheme}
        className={`${enabled ? 'bg-primary' : 'bg-primary/20 '}
        relative items-center inline-flex  h-[38px] w-[74px] border-2 
        border-transparent rounded-full cursor-pointer transition-colors 
        ease-in-out duration-200 focus:outline-none focus-visible:ring-2  
        focus-visible:ring-white focus-visible:ring-opacity-75`}    
            >
            <span className="sr-only">Use setting</span>
            <span
            aria-hidden="true"
            className={`${enabled ? 'translate-x-9' : 'translate-x-0'}
                pointer-events-none inline-block align-text-middle h-[34px] w-[34px] 
                rounded-full bg-white text-black shadow-lg transform ring-0 
                transition ease-in-out duration-200`}
            >
                {enabled ? <Moon className='mx-[5px] my-[8px] bg-transparent h-4'/> : <Sun className='mx-[5px] my-[8px] bg-transparent h-4'/>}
                
            </span>
        </Switch>
    )
}

export default ToggleTheme
