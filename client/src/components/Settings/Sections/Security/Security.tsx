import React, { useState } from 'react';
import { Button } from '../../../UI/ButtonUI/Button';
import { Input } from '../../../UI/InputUI/Input';
import { Label } from '../../../UI/LabelUI/Label';
import { Notification } from '../../../UI/Notification/Notification';
import { Subtitle } from '../../../UI/Subtitle/Subtitle';
import './Security.css';

export const Security = ({ user }: ISecurity) => {
    const [form, setForm] = useState({
        user_id: user.user_id,
        old_hash_password: user.user_password,
        old_password: '',
        new_password: '',
    });
    const [notif, setNotif] = useState({
        title: '',
        text: '',
        active: false,
        type: '',
    });

    function changePassword() {
        fetch('http://localhost:3001/settings/change-password', {
            method: 'POST',
            body: JSON.stringify({ ...form }),
            headers: {
                Accept: '*/*',
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.error) {
                    setNotif({ title: res.message, text: res.error, active: true, type: 'error' });
                } else if (!res.error) {
                    setNotif({
                        title: 'Успешно',
                        text: res.message,
                        active: true,
                        type: 'success',
                    });
                }
            });
    }

    return (
        <>
            <Notification
                setActive={setNotif}
                active={notif.active}
                title={notif.title}
                text={notif.text}
                type={notif.type}
            />
            <div className="security-block">
                <Subtitle>Настройки безопасности</Subtitle>
                <div className="security-roof"></div>
                <div className="security-body">
                    <Label htmlFor="old_password">Старый пароль</Label>
                    <Input
                        setState={setForm}
                        id="old_password"
                        type="password"
                        placeholder="Старый пароль"
                    />
                    <Label htmlFor="new_password">Новый пароль</Label>
                    <Input
                        setState={setForm}
                        id="new_password"
                        type="password"
                        placeholder="Новый пароль"
                    />
                </div>
                <div className="security-footer">
                    <Button func={changePassword} margin="20px 0 0" color="bluebold">
                        Сохранить
                    </Button>
                </div>
            </div>
        </>
    );
};
interface ISecurity {
    user: {
        user_id: number | string;
        user_name: string;
        user_surname: string;
        user_email: string;
        user_avatar: string;
        user_password: string;
    };
}
