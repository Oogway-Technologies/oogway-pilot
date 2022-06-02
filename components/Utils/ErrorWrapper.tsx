import { UilExclamationTriangle } from '@iconscout/react-unicons'
import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'

interface ErrorWrapperProps {
    errorField: string
    children: JSX.Element
}
export const ErrorWrapper: FC<ErrorWrapperProps> = ({
    errorField,
    children,
}: ErrorWrapperProps) => {
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
