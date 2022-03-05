import { useState, useEffect, FC } from 'react'
import { Switch } from '@headlessui/react'
import { Moon } from 'react-feather'
import { useTheme } from 'next-themes'
import { toggleThemeClass } from '../../styles/header'
import Slider from '../Utils/Slider'

interface ToggleThemeProps {
    hasText: boolean
}

const ToggleTheme: FC<ToggleThemeProps> = ({ hasText }) => {
    const { theme, setTheme } = useTheme()
    const [enabled, setEnabled] = useState(false)

    // Maintain state on (re)mount
    useEffect(() => {
        theme === 'light' ? setEnabled(false) : setEnabled(true)
    }, [theme])

    // Helper function to update theme and switch state
    const handleChangeTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light')
        setEnabled(!enabled)
    }

    // Set specs
    const enabledColor = 'bg-primary'
    const disabledColor = 'bg-secondary/30'
<<<<<<< HEAD
=======
    const height = 24
    const width = 36
    const diameter = height - 3
    const transDist = (width - height) / 4
>>>>>>> Create slider

    return (
        <a className={toggleThemeClass.a} onClick={handleChangeTheme}>
            {hasText && (
                <>
                    <Moon className="mx-1" /> Night Mode
                </>
            )}
            <Switch
                checked={enabled}
                onChange={handleChangeTheme}
                className={
                    toggleThemeClass.switchSlide +
<<<<<<< HEAD
=======
                    ` h-[${height}px] w-[${width}px]` +
>>>>>>> Create slider
                    (enabled ? ` ${enabledColor}` : ` ${disabledColor}`)
                }
            >
                <span className="sr-only">Use setting</span>
                <span
                    aria-hidden="true"
                    className={
                        toggleThemeClass.switchButton +
<<<<<<< HEAD
                        (enabled ? ' translate-x-3' : ' translate-x-0')
=======
                        ` h-[${diameter}px] w-[${diameter}px]` +
                        (enabled
                            ? ` translate-x-${transDist}`
                            : ' translate-x-0')
>>>>>>> Create slider
                    }
                ></span>
            </Switch>
        </a>
    )
}

ToggleTheme.defaultProps = {
    hasText: false,
}

export default ToggleTheme
