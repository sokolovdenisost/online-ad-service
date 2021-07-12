import React from 'react';
import './Header.css';

export const Header = ({ user }: IHeader) => {
    return (
        <div className="header-message">
            <div className="header-message-center">
                <div className="header-message-fullname">
                    {user.user_name + ' ' + user.user_surname}
                </div>
                <div className="header-message-status">Онлайн</div>
            </div>
        </div>
    );
};

interface IHeader {
    user: {
        user_name: string;
        user_surname: string;
    };
}
