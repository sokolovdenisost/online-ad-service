import React from 'react';
import { MdPhotoCamera, MdSend } from 'react-icons/md';
import './Input.css';

export const Input = ({ value, change, click }: IInput) => {
    function sendHandlerToEnter(e: React.KeyboardEvent) {
        if (e.keyCode === 13 && value) {
            click();
        }
    }

    return (
        <div className="input-message">
            <div className="input-message-photo">
                <MdPhotoCamera size={30} color="AAAAAA" />
            </div>
            <input
                onChange={change}
                value={value}
                onKeyDown={(e) => sendHandlerToEnter(e)}
                className="input-message-input"
                type="text"
                placeholder="Введите текст сообщения…"
            />
            <div className="input-message-send" onClick={click}>
                <MdSend onClick={click} size={30} color={value ? '3674ff' : 'AAAAAA'} />
            </div>
        </div>
    );
};

interface IInput {
    value: string;
    change: any;
    click: any;
}
