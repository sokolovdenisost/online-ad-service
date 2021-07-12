import React from 'react';
import { NavLink } from 'react-router-dom';
import './NButton.css';

export const NButton = ({ children, title, href, func }: IButton) => {
    function a() {
        if (func) {
            return func();
        }
    }

    return (
        <button onClick={() => a()} className="button-navigator">
            <NavLink
                to={href}
                exact
                activeClassName="navigator-button-active"
                className="navigator-button">
                {children}
                <span>{title}</span>
            </NavLink>
        </button>
    );
};

interface IButton {
    children: JSX.Element;
    title: string;
    href: string;
    func?: any;
}
