import React from 'react';
import './Loader.css';

export const Loader = () => {
    return (
        <div className="lds-ellipsis">
            <div className="loader">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    );
};
