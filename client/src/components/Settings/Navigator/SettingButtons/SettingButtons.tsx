import React from 'react';
import { BiRightArrowAlt } from 'react-icons/bi';
import './SettingButtons.css';

export const SettingButtons = ({
    children,
    title,
    subtitle,
    active,
    change,
    objKey,
}: ISettingButton) => {
    return (
        <button
            className={active ? 'navsettings-button active' : 'navsettings-button'}
            onClick={() => change(objKey, true)}>
            <div className={active ? 'navsettings-left active' : 'navsettings-left'}>
                {children}
                <div className={active ? 'navsettings-info active' : 'navsettings-info'}>
                    <span>{title}</span>
                    <span>{subtitle}</span>
                </div>
            </div>
            <BiRightArrowAlt size={30} color={active ? '#1565d8' : '4a4b57'} />
        </button>
    );
};

interface ISettingButton {
    children: JSX.Element;
    title: string;
    subtitle: string;
    active: Boolean;
    change: Function;
    objKey: string;
}
