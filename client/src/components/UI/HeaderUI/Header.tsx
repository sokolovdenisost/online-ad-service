import React from 'react';
import './Header.css';

export const Header = ({ children }: IHeader) => {
    return <div className="header">{children}</div>;
};

interface IHeader {
    children: string;
}
