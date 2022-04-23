import { FC, ReactChild, ReactChildren } from 'react'

interface CardProps {
    className?: string
    id?: string
    children: ReactChild | ReactChild[] | ReactChildren | ReactChildren[] | any
    ref?: React.Ref<HTMLDivElement>
    onClick?: () => void
}

export const Card: FC<
    React.PropsWithChildren<React.PropsWithChildren<CardProps>>
> = ({ className, id, children, ref, onClick }: CardProps) => {
    return (
        <div
            id={id}
            className={`shadow rounded overflow-auto ${
                className ? className : ''
            }`}
            ref={ref}
            onClick={() => onClick && onClick()}
        >
            {children}
        </div>
    )
}
