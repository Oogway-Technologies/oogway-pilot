import { FC, ReactChild, ReactChildren } from 'react'

interface CardProps {
    className?: string
    id?: string
    children: ReactChild | ReactChild[] | ReactChildren | ReactChildren[] | any
    ref?: React.Ref<HTMLDivElement>
}

export const Card: FC<CardProps> = ({
    className,
    id,
    children,
    ref,
}: CardProps) => {
    return (
        <div
            id={id}
            className={`shadow rounded overflow-auto ${
                className ? className : ''
            }`}
            ref={ref}
        >
            {children}
        </div>
    )
}
