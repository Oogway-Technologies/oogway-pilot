import { FC } from 'react'

import { CollapseStyle } from '../../../styles/utils'

interface CollapseProps {
    className?: string
    show?: boolean
    children: JSX.Element
}

export const Collapse: FC<CollapseProps> = ({
    className,
    show,
    children,
}: CollapseProps) => {
    return show ? (
        <div
            className={`${show ? 'h-auto' : 'h-0'} ${CollapseStyle} ${
                className ? className : ''
            }`}
        >
            {children}
        </div>
    ) : (
        <></>
    )
}
