import React, { FC, ReactNode } from 'react'

import { sidebarWidget } from '../../styles/utils'

type Props = {
    children: ReactNode
    title?: string
    className?: string
}

const SidebarWidget: FC<Props> = ({ children, title, className }) => {
    return (
        <div
            className={`${sidebarWidget.container} ${
                className ? className : ''
            }`}
        >
            {title && <div className={sidebarWidget.title}>{title}</div>}
            {children}
        </div>
    )
}

export default SidebarWidget
