import { ButtonHTMLAttributes, FC, MouseEventHandler, ReactNode } from 'react'

import useMediaQuery from '../../hooks/useMediaQuery'

interface ToolbarButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: JSX.Element | null
    keepText?: boolean
    forceNoText?: boolean
    text?: string
    addStyle?: string
    onClick: MouseEventHandler<HTMLButtonElement>
    type?: 'submit' | 'reset' | 'button'
    className?: string
}

const Button: FC<
    React.PropsWithChildren<React.PropsWithChildren<ToolbarButtonProps>>
> = (props: ToolbarButtonProps & { children?: ReactNode | undefined }) => {
    const {
        icon,
        disabled,
        keepText = false,
        forceNoText,
        text = '',
        addStyle = '',
        onClick,
        type = 'button',
        className,
        ...rest
    } = props
    const isMobile = useMediaQuery('(max-width: 965px)')
    return (
        <button
            {...rest}
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={`inline-flex ${addStyle ? addStyle : ''} ${
                className ? className : ''
            }`}
        >
            {icon}{' '}
            {!forceNoText && (keepText || !isMobile) && (
                <a data-text={text} className="buttonText">
                    {text}
                </a>
            )}
        </button>
    )
}

export default Button
