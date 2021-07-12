import React, { useState } from 'react';
import { Navigator } from '../../components/Settings/Navigator/Navigator';
import { Account } from '../../components/Settings/Sections/Account/Account';
import { Security } from '../../components/Settings/Sections/Security/Security';
import { CMain } from '../../containers/Main/CMain';
import './Settings.css';

export const Settings = ({ auth }: ISettings) => {
    const [section, setSection] = useState({
        account: true,
        security: false,
    });

    function changeSections(key: string, value: Boolean): void {
        setSection({ ...section, account: false, security: false, [key]: value });
    }

    return (
        <CMain>
            <div className="settings-block">
                <div className="settings-left">
                    <Navigator change={changeSections} section={section} />
                </div>
                <div className="settings-right">
                    {section.account ? (
                        <Account user={auth} />
                    ) : section.security ? (
                        <Security user={auth} />
                    ) : null}
                </div>
            </div>
        </CMain>
    );
};

interface ISettings {
    auth: {
        user_id: number | string;
        user_email: string;
        user_name: string;
        user_surname: string;
        user_date_register: string;
        user_place: string;
        user_phone: string;
        user_token: string;
        user_avatar: string;
        user_password: string;
    };
}
