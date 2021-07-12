import React from 'react';
import { CCenter } from '../../../containers/Center/CCenter';
import './404.css';

export const Error404 = () => {
    return (
        <CCenter>
            <div className="error-block">
                <div className="number">404</div>
                <div className="text">Страница не найдена</div>
            </div>
        </CCenter>
    );
};
