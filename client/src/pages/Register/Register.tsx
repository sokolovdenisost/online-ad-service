import React, { useState } from 'react';
import { AuthBlockBG } from '../../components/AuthBlockBG/AuthBlockBG';
import { Form } from '../../components/Register/Form/Form';
import { Header } from '../../components/UI/HeaderUI/Header';
import { Subtitle } from '../../components/UI/Subtitle/Subtitle';
import { CRegister } from '../../containers/Register/CRegister';
import { Notification } from '../../components/UI/Notification/Notification';
import './Register.css';

export const Register = () => {
    const [notif, setNotif] = useState({
        title: '',
        text: '',
        active: false,
        type: '',
    });
    return (
        <CRegister>
            <>
                <Notification
                    setActive={setNotif}
                    active={notif.active}
                    title={notif.title}
                    text={notif.text}
                    type={notif.type}
                />
                <AuthBlockBG position="left" />
                <div className="register-block">
                    <Header>Регистрация</Header>
                    <Subtitle>Зарегистрируйтесь для того чтобы создавать объявления.</Subtitle>
                    <Form setNotif={setNotif} />
                    <div className="register-text">
                        Уже есть аккаунт? <a href="/login">Войдите!</a>
                    </div>
                </div>
            </>
        </CRegister>
    );
};
