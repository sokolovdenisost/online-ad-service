import React from 'react';
import './Button.css';

export const Button = ({ children, title, type, func }: IButton) => {
    return (
        <button onClick={func} className={'button-user ' + type}>
            {children}
            <span>{title}</span>
        </button>
    );
};

interface IButton {
    children: JSX.Element;
    title: string;
    type: string;
    func: any;
}
