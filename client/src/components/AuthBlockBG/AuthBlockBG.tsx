import React from 'react';
import './AuthBlockBG.css';
import backgroundImage from '../../assets/images/auth_bg.png';

export const AuthBlockBG = ({ position }: IAuthBlockBG) => {
    return (
        <div className={'auth-block ' + position}>
            <div className="auth-block-bg">
                <img src={backgroundImage} alt="" />
            </div>
            <div className="auth-block-color"></div>
            <div className="auth-block-info">
                <div className="auth-block-quote">
                    Жизнь - трагедия для тех, кто живет чувствами, и комедия для тех, кто живет умом
                </div>
                <div className="auth-block-author">Жан де Лабрюйер</div>
            </div>
        </div>
    );
};

interface IAuthBlockBG {
    position: string;
}
