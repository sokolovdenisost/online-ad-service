import React from 'react';
import './User.css';

export const UserMessage = ({ id, change, name, surname, avatar, message_room }: IUserMessage) => {
    return (
        <a
            href={`?message_room=${message_room}?user_id=${id}`}
            className="user-message"
            data-id={id}
            onClick={change}>
            <div className="user-message-img">
                <img src={avatar} alt="" />
            </div>
            <div className="user-message-info">
                <div className="user-message-fullname">{name + ' ' + surname}</div>
                <div className="user-message-lastmessage">
                    Я ща стрепсилс тебе куплю, п…Я ща стрепсилс тебе куплю, п…Я ща стрепсилс тебе
                    куплю, п…Я ща стрепсилс тебе куплю, п…
                </div>
            </div>
        </a>
    );
};

interface IUserMessage {
    id: number;
    change: any;
    name: string;
    surname: string;
    avatar: string;
    message_room: number;
}
