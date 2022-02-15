import React, {FC} from "react";
import {useHover} from "../../hooks/useHover";
import {toolTipStyles} from "../../styles/common";

interface TooltipProps {
    children: JSX.Element;
    toolTipText: string;
}

export const Tooltip: FC<TooltipProps> = ({
                                              children,
                                              toolTipText,
                                          }: TooltipProps) => {
    const [hoverRef, isHovered] = useHover<HTMLDivElement>();

    return (
        <div className={toolTipStyles.mainDiv}>
            {isHovered && (
                <div className={toolTipStyles.hoverDiv}>
                    <span className={toolTipStyles.hoverText} style={{width: 'max-content'}}>{toolTipText}</span>
                    <div className={toolTipStyles.tip}/>
                </div>
            )}
            <div ref={hoverRef}>{children}</div>
        </div>
    );
};
