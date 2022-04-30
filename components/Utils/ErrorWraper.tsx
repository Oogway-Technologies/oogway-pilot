import { UilExclamationTriangle } from '@iconscout/react-unicons'
import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'

interface ErrorWraperProps {
    errorField: string
    children: JSX.Element
}
export const ErrorWraper: FC<ErrorWraperProps> = ({
    errorField,
    children,
}: ErrorWraperProps) => {
    const {
        formState: { errors },
    } = useFormContext()

    return (
        <div className="w-full h-auto">
            {children}
            {errors?.[errorField]?.message && (
                <div className="flex items-center mt-2">
                    <UilExclamationTriangle className="fill-error dark:fill-errorDark" />
                    <span className="ml-2 text-error dark:text-errorDark">
                        {errors?.[errorField]?.message}
                    </span>
                </div>
            )}
        </div>
    )
}
