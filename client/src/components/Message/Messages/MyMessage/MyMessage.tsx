import React from 'react';
import { BiCheckDouble } from 'react-icons/bi';
import { useDate } from '../../../../hooks/useDate';
import './MyMessage.css';

export const MyMessage = ({ text, date }: IMessage) => {
    return (
        <div className="mymessage-block">
            <div className="mymessage-block-main">
                <div className="mymessage-block-check">
                    <BiCheckDouble size={20} color="#0C8FE4" />
                </div>
                <div className="mymessage-text">{text}</div>
            </div>
            <div className="mymessage-date">
                {useDate(date, 'date')}, в {useDate(date, 'time')}
            </div>
        </div>
    );
};

interface IMessage {
    text: string;
    date: string;
}
