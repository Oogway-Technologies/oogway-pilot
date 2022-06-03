import { FC } from 'react'

import { CollapseStyle } from '../../../styles/utils'

interface CollapseProps {
    className?: string
    show?: boolean
    children: JSX.Element | JSX.Element[]
    customHeight?: string
}

export const Collapse: FC<
    React.PropsWithChildren<React.PropsWithChildren<CollapseProps>>
> = ({ className, show, children, customHeight = '' }: CollapseProps) => {
    return (
        <div
            className={`${
                show ? (customHeight ? customHeight : 'h-auto') : 'h-0'
            } ${CollapseStyle} transition-[height] ${
                className ? className : ''
            }`}
        >
            {children}
        </div>
    )
}
