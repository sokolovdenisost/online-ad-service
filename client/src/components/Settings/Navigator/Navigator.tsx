import React from 'react';
import { FaRegUser } from 'react-icons/fa';
import { HiOutlineShieldCheck } from 'react-icons/hi';

import './Navigator.css';
import { SettingButtons } from './SettingButtons/SettingButtons';

export const Navigator = ({ section, change }: INavigator) => {
    return (
        <div className="settings-navigator">
            <SettingButtons
                change={change}
                objKey="account"
                title="Настройки аккаунта"
                subtitle="Персональная информация"
                active={section.account}>
                <FaRegUser size={30} />
            </SettingButtons>
            <SettingButtons
                change={change}
                objKey="security"
                title="Настройки безопасности"
                subtitle="Смена пароля"
                active={section.security}>
                <HiOutlineShieldCheck size={30} />
            </SettingButtons>
        </div>
    );
};

interface INavigator {
    section: {
        account: Boolean;
        security: Boolean;
    };
    change: Function;
}
