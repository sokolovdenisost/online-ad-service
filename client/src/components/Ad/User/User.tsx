import React, { useState } from 'react';
import { ButtonOutline } from '../../UI/ButtonUI/Button';
import { BiEnvelope, BiPhone } from 'react-icons/bi';
import './User.css';

export const User = ({ way_com, owner, telephone }: IUser) => {
    const user_id = localStorage.getItem('user_id');
    const [data, setData] = useState({
        owner: user_id,
        enemy: owner.user_id,
    });

    function createMessageRoom() {
        fetch('http://localhost:3001/chat/add-message-room', {
            method: 'POST',
            body: JSON.stringify({ ...data }),
            headers: {
                Accept: '*/*',
                'Content-Type': 'application/json',
            },
        }).then((res) => res.json());
    }

    console.log(user_id, way_com);

    return (
        <div className="user-block">
            <div className="user-info">
                <img src={owner.user_avatar} alt="" />
                <div className="user-info-block">
                    <div className="user-name">{owner.user_name + ' ' + owner.user_surname}</div>
                    <div className="user-date">Зарегистрирован {owner.user_date_register}</div>
                    <a href={'/user/' + owner.user_id} className="user-view-profile">
                        Посмотреть профиль
                    </a>
                </div>
            </div>
            <div className="user-description">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                Ipsum has been the industry's standard dummy text ever since the 1500s, when an
                unknown printer took a galley of type and scrambled it to make a type specimen book.
                It has survived not only five centuries, but also the leap into electronic
                typesetting.
            </div>
            <div className="user-buttons">
                {owner.user_id === Number(user_id) ? null : way_com ===
                  'Телефон или личные сообщения' ? (
                    <>
                        <ButtonOutline
                            margin="0 0 5px"
                            title="Написать сообщение"
                            color="blue"
                            func={createMessageRoom}
                            href="/messages">
                            <BiEnvelope size={30} />
                        </ButtonOutline>
                        {telephone ? (
                            <ButtonOutline margin="0" title="Позвонить" color="green">
                                <BiPhone size={30} />
                            </ButtonOutline>
                        ) : null}
                    </>
                ) : way_com === 'Телефон' ? (
                    <ButtonOutline margin="0" title="Позвонить" color="green">
                        <BiPhone size={30} />
                    </ButtonOutline>
                ) : way_com === 'Личные сообщения' ? (
                    <ButtonOutline
                        margin="0 0 5px"
                        title="Написать сообщение"
                        color="blue"
                        func={createMessageRoom}
                        href="/messages">
                        <BiEnvelope size={30} />
                    </ButtonOutline>
                ) : null}
                {user_id ? null : (
                    <div className="user-buttons-blur">
                        <a href="/login">Войдите</a> чтобы написать сообщение
                    </div>
                )}
            </div>
        </div>
    );
};

interface IUser {
    owner: {
        user_id: number;
        user_name: string;
        user_surname: string;
        user_email: string;
        user_date_register: string;
        user_avatar: string;
    };
    telephone: string;
    way_com: string;
}
