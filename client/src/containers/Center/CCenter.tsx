import React from 'react';
import './CCenter.css';

export const CCenter = ({ children }: ICenter) => {
    return <div className="center-container">{children}</div>;
};

interface ICenter {
    children: JSX.Element;
}
