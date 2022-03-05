import React, { FC } from 'react'
import { compareFormClass } from '../../../../styles/feed'

interface _CompareInputFormProps {
    children: JSX.Element
    title?: string
}

const _CompareInputForm: FC<_CompareInputFormProps> = ({ children, title }) => {
    return (
        <div className={compareFormClass.tab + ' flex flex-col p-md'}>
            {title && (
                <div className={compareFormClass.smallGreyText + ' font-bold'}>
                    {title}
                </div>
            )}
            {children}
        </div>
    )
}

export default _CompareInputForm
