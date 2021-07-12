import React from 'react';
import './CMain.css';

export const CMain = ({ children }: IMain) => {
    return <div className="main-container">{children}</div>;
};

interface IMain {
    children: JSX.Element | string;
}
