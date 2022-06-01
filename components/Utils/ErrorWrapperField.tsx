import { UilExclamationTriangle } from '@iconscout/react-unicons'
import React, { FC } from 'react'

import { body } from '../../styles/typography'

interface ErrorWrapperFieldProps {
    errorField: string
    children: JSX.Element | JSX.Element[]
    textClass?: string
}
export const ErrorWrapperField: FC<ErrorWrapperFieldProps> = ({
    errorField,
    children,
    textClass,
}: ErrorWrapperFieldProps) => {
    return (
        <div className="relative w-full h-auto">
            {children}
            {errorField && (
                <div className="flex items-center mt-2">
                    <UilExclamationTriangle className="fill-error dark:fill-errorDark" />
                    <span
                        className={`${body} ml-2 text-error dark:text-errorDark ${
                            textClass ? textClass : ''
                        }`}
                    >
                        {errorField}
                    </span>
                </div>
            )}
        </div>
    )
}
