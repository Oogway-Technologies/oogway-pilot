import React from 'react'

interface BaseCardProps {
    children: JSX.Element | JSX.Element[] | any
    className?: string
}
export const BaseCard = ({ children, className }: BaseCardProps) => {
    return (
        <div
            className={`bg-white dark:bg-neutralDark-500 rounded-2xl custom-box-shadow dark:custom-box-shadow-dark ${
                className ? className : ''
            }`}
        >
            {children}
        </div>
    )
}
