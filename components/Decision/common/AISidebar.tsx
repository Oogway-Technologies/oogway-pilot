import { UilInfoCircle } from '@iconscout/react-unicons'
import React, { FC } from 'react'

import useMediaQuery from '../../../hooks/useMediaQuery'

interface AISidebarProps {
    title?: string
    subtitle?: string
    children: JSX.Element
}

const AISidebar: FC<AISidebarProps> = ({ title, subtitle, children }) => {
    const isMobile = useMediaQuery('(max-width: 965px)')
    return (
        <div
            className={
                'flex flex-col bg-white dark:bg-neutralDark-500 md:py-4 md:px-3 md:mb-4 md:rounded-2xl md:shadow-md md:dark:shadow-black/60'
            }
        >
            <div className="flex items-center md:mb-3">
                {title && (
                    <span
                        className={
                            'text-base font-bold leading-6 text-primary dark:text-primaryDark  md:text-2xl'
                        }
                    >
                        {title}
                    </span>
                )}
                {subtitle && (
                    <span
                        className={
                            'text-base leading-6 text-neutral-300 dark:text-neutralDark-50 md:text-md'
                        }
                    >
                        {subtitle}
                    </span>
                )}
                {!isMobile && (
                    <UilInfoCircle
                        className={
                            'justify-self-end ml-auto fill-neutral-700 dark:fill-neutralDark-150'
                        }
                    />
                )}
            </div>
            {children}
        </div>
    )
}

export default AISidebar
