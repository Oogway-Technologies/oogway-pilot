import { useMediaQuery } from '@mui/material';
import React from 'react';

interface ToolbarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon: any,
    keepText: boolean
    text: string
    addStyle: string,
    onClick: React.MouseEventHandler<HTMLButtonElement>,
    type: 'submit' | 'reset' | 'button' | undefined;
};

const Button: React.FC<ToolbarButtonProps> = ({icon, keepText, text, addStyle, onClick, type }) => {
    const isMobile = useMediaQuery('(max-width: 768px)')

    return (
        <button
            type={type}
            onClick={onClick}
            className={"testing inline-flex " + addStyle}>
            {icon} <a data-text={text} className="buttonText">{(keepText || !isMobile ) && text}</a>
        </button>
        );
    };

Button.defaultProps = {
    keepText: false,
    text: '',
    addStyle: '',
    type: 'button'
}

export default Button;
