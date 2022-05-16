import React, { FC } from 'react'

interface GenericSidebarProps {
    title?: string
    titleClass?: string
    extraClass?: string
    children: JSX.Element
}

const GenericSidebar: FC<GenericSidebarProps> = ({
    title,
    titleClass,
    extraClass,
    children,
}) => {
    return (
        <div
            className={
                'flex flex-col bg-white dark:bg-neutralDark-500 md:py-4 md:px-3 md:mb-4 md:rounded-2xl md:shadow-md md:dark:shadow-black/60 ' +
                (extraClass && extraClass)
            }
        >
            <div className="flex items-center">
                {title && (
                    <span
                        className={
                            titleClass
                                ? titleClass
                                : 'text-base font-bold leading-6 text-primary dark:text-primaryDark  md:text-2xl '
                        }
                    >
                        {title}
                    </span>
                )}
            </div>
            {children}
        </div>
    )
}

export default GenericSidebar
