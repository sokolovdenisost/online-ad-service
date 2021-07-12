import React, { useState } from 'react';
import { AuthBlockBG } from '../../components/AuthBlockBG/AuthBlockBG';
import { Form } from '../../components/Login/Form/Form';
import { Header } from '../../components/UI/HeaderUI/Header';
import { Subtitle } from '../../components/UI/Subtitle/Subtitle';
import { CLogin } from '../../containers/Login/CLogin';
import { Notification } from '../../components/UI/Notification/Notification';
import './Login.css';

export const Login = () => {
    const [notif, setNotif] = useState({
        title: '',
        text: '',
        active: false,
        type: '',
    });
    return (
        <CLogin>
            <>
                <Notification
                    setActive={setNotif}
                    active={notif.active}
                    title={notif.title}
                    text={notif.text}
                    type={notif.type}
                />
                <AuthBlockBG position="right" />
                <div className="login-block">
                    <Header>Авторизация</Header>
                    <Subtitle>Авторизация - это главный момент чтобы начать торговлю.</Subtitle>
                    <Form setNotif={setNotif} />
                    <div className="login-text">
                        Нет аккаунта? <a href="/register">Зарегистрируйтесь!</a>
                    </div>
                </div>
            </>
        </CLogin>
    );
};
