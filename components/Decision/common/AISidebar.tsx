import { UilInfoCircle } from '@iconscout/react-unicons'
import React, { FC } from 'react'

import useMediaQuery from '../../../hooks/useMediaQuery'
import { bodySmallHeavy } from '../../../styles/typography'

interface AISidebarProps {
    title?: string
    subtitle?: string
    infoCircle?: boolean
    children: JSX.Element
    className?: string
}

const AISidebar: FC<AISidebarProps> = ({
    title,
    subtitle,
    infoCircle,
    children,
    className = '',
}) => {
    const isMobile = useMediaQuery('(max-width: 965px)')
    return (
        <div
            className={`flex flex-col ${
                isMobile
                    ? 'my-4'
                    : 'custom-box-shadow dark:custom-box-shadow-dark mb-4 mr-4 rounded-2xl bg-white py-4 px-3 dark:bg-neutralDark-500'
            } ${className}`}
        >
            <div className="flex items-center md:mb-2">
                {title && (
                    <span
                        className={`${
                            isMobile
                                ? bodySmallHeavy
                                : 'font-bold leading-6 text-2xl'
                        } text-primary dark:text-primaryDark`}
                    >
                        {title}
                    </span>
                )}
                {subtitle && (
                    <span
                        className={
                            'text-base leading-6 text-neutral-300 dark:text-neutralDark-50 md:text-base'
                        }
                    >
                        {subtitle}
                    </span>
                )}
                {!isMobile && infoCircle && (
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
