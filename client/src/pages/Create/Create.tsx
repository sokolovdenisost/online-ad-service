import React, { useState } from 'react';
import { Form } from '../../components/Create/Form/Form';
import { Header } from '../../components/UI/HeaderUI/Header';
import { Notification } from '../../components/UI/Notification/Notification';
import { Subtitle } from '../../components/UI/Subtitle/Subtitle';
import { CCenter } from '../../containers/Center/CCenter';
import './Create.css';

export const Create = () => {
    const [notif, setNotif] = useState({
        title: '',
        text: '',
        active: false,
        type: '',
    });
    return (
        <CCenter>
            <>
                <Notification
                    setActive={setNotif}
                    active={notif.active}
                    title={notif.title}
                    text={notif.text}
                    type={notif.type}
                />
                <div className="create-block">
                    <div className="create-roof">
                        <Header>Создание объявления</Header>
                        <Subtitle>Параметры</Subtitle>
                    </div>
                    <Form setNotif={setNotif} />
                </div>
            </>
        </CCenter>
    );
};
