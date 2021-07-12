import React from 'react';
import './Button.css';

export const Button = ({ children, margin, func, color }: IButton) => {
    return (
        <button
            type="submit"
            onClick={(e) => func(e)}
            className={'button ' + color}
            style={{ margin }}>
            {children}
        </button>
    );
};

export const ButtonOutline = ({ children, margin, title, color, padding, func, href }: IButton) => {
    return (
        <a className="button-outline-link" href={href}>
            <button
                onClick={() => func()}
                className={'button-outline ' + color}
                style={{ margin, padding }}>
                {children}
                <span>{title}</span>
            </button>
        </a>
    );
};

interface IButton {
    children: string | JSX.Element;
    margin: string;
    title?: string;
    color?: string;
    func?: any;
    padding?: string;
    href?: string;
}
