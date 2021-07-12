import React from 'react';
import './Info.css';

export const Info = ({ user, subscribers, subscriptions }: IInfo) => {
    return (
        <div className="info-block">
            <div className="info-fullName">{user.user_name + ' ' + user.user_surname}</div>
            <div className="info-date-register">
                <span>Зарегистрирован</span>
                <span>{user.user_date_register}</span>
            </div>
            {user.user_place ? <div className="info-place">{user.user_place}</div> : null}
            <div className="info-subs-follows">
                <span>{subscribers.length} подписчиков</span>
                <span>{subscriptions.length} подписок</span>
            </div>
        </div>
    );
};

interface IInfo {
    user: {
        user_id: number | string;
        user_email: string;
        user_name: string;
        user_surname: string;
        user_date_register: string;
        user_place: string;
        user_phone: string;
    };
    subscribers: Array<{
        sub: number;
        sub_id: number;
        sub_to_id: number;
    }>;
    subscriptions: Array<{
        sub: number;
        sub_id: number;
        sub_to_id: number;
    }>;
}
