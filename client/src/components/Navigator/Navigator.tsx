import React, { useState, useEffect } from 'react';
import { AiFillStar, AiFillAppstore, AiFillMessage, AiOutlineUserAdd } from 'react-icons/ai';
import { MdSettings } from 'react-icons/md';
import { FaUserCircle } from 'react-icons/fa';
import { IoMdLogOut, IoMdLogIn } from 'react-icons/io';
import { BsFillPlusSquareFill } from 'react-icons/bs';

import './Navigator.css';
import { NButton } from './NButton/NButton';

export const Navigator = ({ auth }: INavigator) => {
    const [location, setLocation] = useState('');
    const token = localStorage.getItem('token');

    async function logoutUser(e: React.MouseEvent) {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        await fetch('http://localhost:3001/auth/logout', {
            headers: {
                Authorization: `Token ${token}`,
            },
        })
            .then((res) => res.json())
            .then((res) => {
                if (!res.error) {
                    window.location.reload(true);
                }
            });
    }
    const user_id = localStorage.getItem('user_id');

    function locationInProfile() {
        if (location.includes('/user/')) {
            if (location !== `/user/${user_id}`) {
                window.location.reload(true);
            }
        }
    }

    useEffect(() => {
        setLocation(window.location.pathname);
    }, [location]);

    if (auth) {
        return (
            <div className="navigator-block">
                <NButton title="Объявления" href="/">
                    <AiFillAppstore size={24} />
                </NButton>
                <NButton title="Разместить" href="/create">
                    <BsFillPlusSquareFill size={24} />
                </NButton>
                <NButton title="Избранное" href="/favorite">
                    <AiFillStar size={24} />
                </NButton>
                <NButton title="Сообщения" href="/messages">
                    <AiFillMessage size={24} />
                </NButton>
                <NButton title="Профиль" func={locationInProfile} href={'/user/' + user_id}>
                    <FaUserCircle size={24} />
                </NButton>
                <NButton title="Настройки" href="/settings">
                    <MdSettings size={24} />
                </NButton>
                <NButton func={logoutUser} title="Выход" href="/logout">
                    <IoMdLogOut size={24} />
                </NButton>
            </div>
        );
    }
    return (
        <div className="navigator-block">
            <NButton title="Объявления" href="/">
                <AiFillAppstore size={24} />
            </NButton>
            <NButton title="Регистрация" href="/register">
                <AiOutlineUserAdd size={24} />
            </NButton>
            <NButton title="Вход" href="/login">
                <IoMdLogIn size={24} />
            </NButton>
        </div>
    );
};

interface INavigator {
    auth: Boolean;
}
