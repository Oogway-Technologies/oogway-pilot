import { FC, ReactChild, ReactChildren } from 'react'

interface CardProps {
    className?: string
    children: ReactChild | ReactChild[] | ReactChildren | ReactChildren[] | any
    ref?: React.Ref<HTMLDivElement>
}

export const Card: FC<CardProps> = ({
    className,
    children,
    ref,
}: CardProps) => {
    return (
        <div
            className={`shadow rounded overflow-hidden ${
                className ? className : ''
            }`}
            ref={ref}
        >
            {children}
        </div>
    )
}
