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
        <div className="h-auto w-full">
            {children}
            {errors?.[errorField]?.message && (
                <div className="mt-2 flex items-center">
                    <UilExclamationTriangle className="fill-error dark:fill-errorDark" />
                    <span className="ml-2 text-error dark:text-errorDark">
                        {errors?.[errorField]?.message}
                    </span>
                </div>
            )}
        </div>
    )
}
