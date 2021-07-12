import React from 'react';
import './Button.css';

export const ProfileButton = ({ active, title, count, change, objKey }: IProfileButton) => {
    return (
        <button
            onClick={() => change(objKey, true)}
            className={active ? 'profile-button active' : 'profile-button'}>
            <span>{title}</span>
            <span>{count}</span>
        </button>
    );
};

interface IProfileButton {
    active: Boolean;
    title: string;
    count: number;
    change: Function;
    objKey: string;
}
