import { UilExclamationTriangle } from '@iconscout/react-unicons'
import React, { FC } from 'react'

interface ErrorWraperFieldProps {
    errorField: string
    children: JSX.Element
}
export const ErrorWraperField: FC<ErrorWraperFieldProps> = ({
    errorField,
    children,
}: ErrorWraperFieldProps) => {
    return (
        <div className="relative w-full h-auto">
            {children}
            {errorField && (
                <div className="flex items-center mt-2">
                    <UilExclamationTriangle className="fill-error dark:fill-errorDark" />
                    <span className="ml-2 text-error dark:text-errorDark">
                        {errorField}
                    </span>
                </div>
            )}
        </div>
    )
}
