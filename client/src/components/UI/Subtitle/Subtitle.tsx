import React, { CSSProperties } from 'react';
import './Subtitle.css';

export const Subtitle = ({ children, style }: ISubtitle) => {
    return (
        <div style={style} className="sub-title">
            {children}
        </div>
    );
};

interface ISubtitle {
    children: string;
    style?: CSSProperties;
}
