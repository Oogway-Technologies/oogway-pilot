import React, { FC } from 'react'

interface TooltipProps {
    children: JSX.Element
    toolTipText: string
}

export const Tooltip: FC<TooltipProps> = ({
    children,
    toolTipText,
}: TooltipProps) => {
    return (
        <div className={'relative flex flex-col items-center group'}>
            {children}
            <div
                className={
                    'absolute bottom-0 flex flex-col items-center hidden mb-11 group-hover:flex'
                }
            >
                <span
                    className={
                        'w-max rounded-[8px] relative z-10 p-1 text-xs text-primary bg-white dark:bg-neutralDark-500 shadow-lg border-solid border-[1px] border-neutral-300'
                    }
                >
                    {toolTipText}
                </span>
                <div
                    className={
                        'w-3 h-3 -mt-2 rotate-45 bg-white dark:bg-neutralDark-500 border-solid border-[1px] border-neutral-300'
                    }
                />
            </div>
        </div>
    )
}
