import React from 'react';
import './CRegister.css';

export const CRegister = ({ children }: IRegister) => {
    return <div className="register-container">{children}</div>;
};

interface IRegister {
    children: JSX.Element;
}
