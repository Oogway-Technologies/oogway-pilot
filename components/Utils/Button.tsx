import { useMediaQuery } from '@mui/material';
import React, { useEffect, useRef } from 'react';

interface ToolbarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon: any,
    keepText: boolean
    forceNoText: boolean
    text: string
    addStyle: string,
    onClick: React.MouseEventHandler<HTMLButtonElement>,
    type: 'submit' | 'reset' | 'button' | undefined;
};

const Button: React.FC<ToolbarButtonProps> = ({icon, keepText, forceNoText, text, addStyle, onClick, type }) => {
    const isMobile = useMediaQuery('(max-width: 965px)')

    return (
        <button
            type={type}
            onClick={onClick}
            className={"inline-flex " + addStyle}>
            {icon} {!forceNoText && <a data-text={( keepText || !isMobile ) ? text : null} className="buttonText">{( keepText || !isMobile ) && text}</a>}
        </button>
        );
    };

Button.defaultProps = {
    keepText: false,
    isActive: false,
    text: '',
    addStyle: '',
    type: 'button'
}

export default Button;
