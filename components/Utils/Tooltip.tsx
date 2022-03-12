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
        <div className={'group flex relative flex-col items-center'}>
            {children}
            <div
                className={
                    'hidden group-hover:flex absolute bottom-0 flex-col items-center mb-11'
                }
            >
                <span
                    className={
                        'relative z-10 p-1 w-max text-xs text-primary bg-white dark:bg-neutralDark-500 rounded-[8px] border-[1px] border-neutral-300 border-solid shadow-lg'
                    }
                >
                    {toolTipText}
                </span>
                <div
                    className={
                        '-mt-2 w-3 h-3 bg-white dark:bg-neutralDark-500 border-[1px] border-neutral-300 border-solid rotate-45'
                    }
                />
            </div>
        </div>
    )
}
