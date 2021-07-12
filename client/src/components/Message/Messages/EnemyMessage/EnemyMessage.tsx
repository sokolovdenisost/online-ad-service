import React from 'react';
import { useDate } from '.././../../../hooks/useDate';
import './EnemyMessage.css';

export const EnemyMessage = ({ text, date }: IMessage) => {
    return (
        <div className="enemymessage-block">
            <div className="enemymessage-block-main">
                <div className="enemymessage-text">{text}</div>
            </div>
            <div className="enemymessage-date">
                {useDate(date, 'date')}, в {useDate(date, 'time')}
            </div>
        </div>
    );
};

interface IMessage {
    text: string;
    date: string;
}
