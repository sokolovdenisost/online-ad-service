import React from 'react';
import './CLogin.css';

export const CLogin = ({ children }: ILogin) => {
    return <div className="login-container">{children}</div>;
};

interface ILogin {
    children: JSX.Element;
}
