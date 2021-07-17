import React, { useState } from 'react';
import { Button } from '../../../UI/ButtonUI/Button';
import { Input } from '../../../UI/InputUI/Input';
import { Label } from '../../../UI/LabelUI/Label';
import { AiOutlineSync } from 'react-icons/ai';
import './Account.css';
import { Subtitle } from '../../../UI/Subtitle/Subtitle';
import { Notification } from '../../../UI/Notification/Notification';
import { URL_API } from '../../../../CONSTS';

export const Account = ({ user }: IAccount) => {
    const [avatar, setAvatar] = useState<IAvatar>({
        url: user.user_avatar,
        blob: '',
    });
    const [info, setInfo] = useState<IInfo>({
        user_id: user.user_id,
        name: user.user_name,
        surname: user.user_surname,
        email: user.user_email,
    });
    const [notif, setNotif] = useState({
        title: '',
        text: '',
        active: false,
        type: '',
    });

    function changeAvatar(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            const img_url = URL.createObjectURL(e.target.files[0]);
            setAvatar({ ...avatar, url: img_url, blob: e.target.files[0] });
        }
    }

    function changePersonalDate() {
        const formData = new FormData();
        formData.append('avatar', avatar.blob);

        for (let elem in info) {
            formData.append(elem, info[elem]);
        }

        fetch(`${URL_API}/settings/change-personal`, {
            method: 'POST',
            body: formData,
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.error) {
                    setNotif({
                        title: res.message,
                        text: res.error,
                        active: true,
                        type: 'error',
                    });
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
            <div className="account-block">
                <input onChange={(e) => changeAvatar(e)} type="file" name="avatar" id="avatar" />
                <Subtitle>Настройки аккаунта</Subtitle>
                <div className="account-roof">
                    <label htmlFor="avatar">
                        <div className="account-image">
                            <img src={avatar.url} alt="" />
                            <div className="account-image-change">
                                <AiOutlineSync size={100} color="#eee" />
                            </div>
                        </div>
                    </label>
                </div>
                <div className="account-body">
                    <div className="account-roof-right">
                        <Label htmlFor="name">Имя</Label>
                        <Input
                            setState={setInfo}
                            id="name"
                            placeholder="Ваше имя"
                            margin="5px 0 22px"
                            value={info.name}
                        />
                        <Label htmlFor="surname">Фамилия</Label>
                        <Input
                            setState={setInfo}
                            id="surname"
                            placeholder="Ваша фамилия"
                            margin="5px 0 22px"
                            value={info.surname}
                        />
                        <Label htmlFor="email">Email</Label>
                        <Input
                            setState={setInfo}
                            id="email"
                            placeholder="Ваш email"
                            margin="5px 0 22px"
                            value={info.email}
                        />
                    </div>
                </div>
                <div className="account-footer">
                    <Button margin="20px 0 0" func={changePersonalDate} color="bluebold">
                        Сохранить
                    </Button>
                </div>
            </div>
        </>
    );
};

interface IAccount {
    user: {
        user_id: number | string;
        user_name: string;
        user_surname: string;
        user_email: string;
        user_avatar: string;
    };
}

interface IInfo {
    [key: string]: any;
    user_id: number | string;
    name: string;
    surname: string;
    email: string;
}

interface IAvatar {
    url: string;
    blob: Blob | string;
}
