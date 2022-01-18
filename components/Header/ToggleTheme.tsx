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

    // Helper function to update theme and switch state
    const handleChangeTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light')
        setEnabled(!enabled)
    }

    return (
        <Switch
        checked={enabled}
        onChange={handleChangeTheme}
        className={`${enabled ? 'bg-primary' : 'bg-secondary/30'}
        relative items-center inline-flex  h-[20px] w-[32px] md:h-[38px] md:w-[62px] border-2 
        border-transparent rounded-full cursor-pointer transition-colors 
        ease-in-out duration-200 focus:outline-none focus-visible:ring-2  
        focus-visible:ring-white focus-visible:ring-opacity-75
        hover:shadow-md hover:shadow-secondary/20 dark:hover:shadow-primary/30`}    
            >
            <span className="sr-only">Use setting</span>
            <span
            aria-hidden="true"
            className={`${enabled ? 'translate-x-3 md:translate-x-6' : 'translate-x-0'}
                pointer-events-none inline-block align-text-middle h-[18px] w-[18px] md:h-[34px] md:w-[34px] 
                rounded-full bg-white shadow-lg transform ring-0
                transition ease-in-out duration-200`}
            >
                {enabled ? 
                <Moon className='-mx-[3px] md:mx-[5px] mt-[3px] md:my-[8px] h-3 md:h-4 bg-transparent text-black'/> : 
                <Sun className='-mx-[3px] md:mx-[5px] my-[3px] md:my-[8px] h-3 md:h-4 bg-transparent text-alert'/>}
                
            </span>
        </Switch>
    )
}

export default ToggleTheme
