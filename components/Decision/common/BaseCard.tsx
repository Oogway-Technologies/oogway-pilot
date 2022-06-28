import React from 'react'

interface BaseCardProps {
    children: JSX.Element | JSX.Element[] | any
    className?: string
}
export const BaseCard = ({ children, className }: BaseCardProps) => {
    return (
        <div
            className={`custom-box-shadow dark:custom-box-shadow-dark rounded-2xl bg-white dark:bg-neutralDark-500 ${
                className ? className : ''
            }`}
        >
            {children}
        </div>
    )
}
