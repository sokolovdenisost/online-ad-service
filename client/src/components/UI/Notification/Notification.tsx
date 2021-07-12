import React from 'react';
import { BiErrorAlt } from 'react-icons/bi';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { ButtonOutline } from '../ButtonUI/Button';

import './Notification.css';

export const Notification = ({ setActive, active, title, text, type }: INotification) => {
    function closeNotification() {
        if (type === 'error') {
            setActive({ title: '', text: '', active: false, type: '' });
        } else if (type === 'success') {
            setActive({ title: '', text: '', active: false, type: '' });
            window.location.reload(true);
        }
    }

    return (
        <div
            onClick={() => setActive({ title: '', text: '', active: false, type: '' })}
            className={active ? 'notification-overlay active' : 'notification-overlay'}>
            <div
                className={active ? 'notification-block active' : 'notification-block'}
                onClick={(e) => e.stopPropagation()}>
                <div className="notification-icon">
                    {type === 'error' ? (
                        <BiErrorAlt color="#c8372d" size={200} />
                    ) : (
                        <AiOutlineCheckCircle color="#1bb55c" size={200} />
                    )}
                </div>
                <div className="notification-title">
                    {title ? title : type === 'error' ? 'Ошибка' : 'Успешно'}
                </div>
                <div className="notification-text">
                    {text ? text : 'Пользователь с таким email ненайден'}
                </div>
                <div className="notification-btn">
                    <ButtonOutline
                        func={closeNotification}
                        padding="10px 0"
                        color={type === 'error' ? 'red' : 'green'}
                        margin="20px 0 0">
                        Хорошо
                    </ButtonOutline>
                </div>
            </div>
        </div>
    );
};

interface INotification {
    setActive: React.Dispatch<
        React.SetStateAction<{ title: string; text: string; active: boolean; type: string }>
    >;
    active: boolean;
    title: string;
    text: string;
    type: string;
}
