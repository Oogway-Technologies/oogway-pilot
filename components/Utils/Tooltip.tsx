import React, { FC } from 'react'

interface TooltipProps {
    children: JSX.Element
    toolTipText: string
    className?: string
    classForParent?: string
    classForToolTipBox?: string
    classForBottomArrow?: string
    removeFlexFromParent?: boolean
}

export const Tooltip: FC<
    React.PropsWithChildren<React.PropsWithChildren<TooltipProps>>
> = ({
    children,
    toolTipText,
    className = '',
    classForParent = '',
    classForToolTipBox = '',
    classForBottomArrow = '',
    removeFlexFromParent = false,
}: TooltipProps) => {
    return (
        <div
            className={`group relative ${
                !removeFlexFromParent ? 'flex flex-col items-center' : ''
            } ${className}`}
        >
            {children}
            <div
                className={`absolute bottom-0 mb-11 hidden flex-col items-center group-hover:flex ${classForParent}`}
            >
                <span
                    className={`relative z-10 w-max rounded-[8px] border-[1px] border-solid border-neutral-300 bg-white p-1 text-primary shadow-lg text-xs dark:bg-neutralDark-500 ${classForToolTipBox}`}
                >
                    {toolTipText}
                </span>
                <div
                    className={`-mt-2 h-3 w-3 rotate-45 border-[1px] border-solid border-neutral-300 bg-white dark:bg-neutralDark-500 ${classForBottomArrow}`}
                />
            </div>
        </div>
    )
}
