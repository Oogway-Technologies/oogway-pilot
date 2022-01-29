import Reaact, { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';
import { Moon } from 'react-feather';
import { useTheme } from 'next-themes';

interface ToggleThemeProps {
    hasText: boolean
}

const ToggleTheme: React.FC<ToggleThemeProps> = ({ hasText }) => {
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
        <a 
        className="inline-flex group-hover:text-black active:text-black dark:group-hover:text-neutralDark-50 
        dark:active:text-neutralDark-50 cursor-pointer" 
        onClick={handleChangeTheme}>
            {hasText && <><Moon className='mx-1'/> Night Mode</> }
            <Switch
            checked={enabled}
            onChange={handleChangeTheme}
            className={`${enabled ? 'bg-primary' : 'bg-secondary/30'}
            ml-4 items-center inline-flex h-[24px] w-[36px] border-2 
            border-transparent rounded-full cursor-pointer transition-colors 
            ease-in-out duration-200 focus:outline-none focus-visible:ring-2  
            focus-visible:ring-white focus-visible:ring-opacity-75
            hover:shadow-md hover:shadow-secondary/20 dark:hover:shadow-primary/30`}    
                >
                <span className="sr-only">Use setting</span>
                <span
                aria-hidden="true"
                className={`${enabled ? 'translate-x-3' : 'translate-x-0'}
                    pointer-events-none inline-block align-text-middle h-[21px] w-[21px] 
                    rounded-full bg-white shadow-lg transform ring-0
                    transition ease-in-out duration-200`}
                >   
                </span>
            </Switch>
        </a>
    )
}

ToggleTheme.defaultProps = {
    hasText: false
}

export default ToggleTheme
