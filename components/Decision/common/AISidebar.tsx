import { UilInfoCircle } from '@iconscout/react-unicons'
import React, { FC } from 'react'

import useMediaQuery from '../../../hooks/useMediaQuery'

interface AISidebarProps {
    title: string
    children: JSX.Element
}

const AISidebar: FC<AISidebarProps> = ({ title, children }) => {
    const isMobile = useMediaQuery('(max-width: 965px)')
    return (
        <div
            className={
                'flex flex-col bg-white dark:bg-neutralDark-500 md:py-4 md:px-3 md:mb-4 md:rounded-2xl md:shadow-md md:dark:shadow-black/60'
            }
        >
            <div className="flex items-center md:mb-3">
                <span
                    className={
                        'text-base font-bold leading-6 text-primary dark:text-primaryDark  md:text-2xl'
                    }
                >
                    {title}
                </span>
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
