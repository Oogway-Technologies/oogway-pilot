import React, { FC } from 'react'

interface TooltipProps {
    children: JSX.Element
    toolTipText: string
    className?: string
    classForParent?: string
    classForToolTipBox?: string
    classForBottomArrow?: string
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
}: TooltipProps) => {
    return (
        <div
            className={`group flex relative flex-col items-center ${className}`}
        >
            {children}
            <div
                className={`hidden group-hover:flex absolute bottom-0 flex-col items-center mb-11 ${classForParent}`}
            >
                <span
                    className={`relative z-10 p-1 w-max text-xs text-primary bg-white dark:bg-neutralDark-500 rounded-[8px] border-[1px] border-neutral-300 border-solid shadow-lg ${classForToolTipBox}`}
                >
                    {toolTipText}
                </span>
                <div
                    className={`-mt-2 w-3 h-3 bg-white dark:bg-neutralDark-500 border-[1px] border-neutral-300 border-solid rotate-45 ${classForBottomArrow}`}
                />
            </div>
        </div>
    )
}
