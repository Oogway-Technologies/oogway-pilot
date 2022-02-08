import {useMediaQuery} from '@mui/material';
import {ButtonHTMLAttributes, FC, MouseEventHandler, ReactNode} from 'react';

interface ToolbarButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon: any,
    keepText?: boolean
    forceNoText?: boolean
    text?: string
    addStyle?: string,
    onClick: MouseEventHandler<HTMLButtonElement>,
    type?: 'submit' | 'reset' | 'button';
}

const Button: FC<ToolbarButtonProps> = (props: ToolbarButtonProps & { children?: ReactNode | undefined }) => {
    const {
        icon,
        keepText = false,
        forceNoText,
        text = '',
        addStyle = '',
        onClick,
        type = 'button'
    } = props;
    const isMobile = useMediaQuery('(max-width: 965px)')
    return (
        <button
            type={type}
            onClick={onClick}
            className={"inline-flex " + addStyle}>
            {icon} {!forceNoText && <a data-text={(keepText || !isMobile) ? text : null}
                                       className="buttonText">{(keepText || !isMobile) && text}</a>}
        </button>
    );
};

export default Button;
