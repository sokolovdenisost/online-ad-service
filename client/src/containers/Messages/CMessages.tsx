import React from 'react';
import './CMessages.css';

export const CMessages = ({ children }: ICMessages) => {
    return <div className="container-messages">{children}</div>;
};

interface ICMessages {
    children: JSX.Element | JSX.Element[];
}
