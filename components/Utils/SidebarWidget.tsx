import React, { FC, ReactNode } from 'react'

import { sidebarWidget } from '../../styles/utils'

type Props = {
    children: ReactNode
    title?: string
}

const SidebarWidget: FC<Props> = ({ children, title }) => {
    return (
        <div className={sidebarWidget.container}>
            {title && <div className={sidebarWidget.title}>{title}</div>}
            {children}
        </div>
    )
}

export default SidebarWidget
