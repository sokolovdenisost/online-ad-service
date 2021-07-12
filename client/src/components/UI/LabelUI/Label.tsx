import React from 'react';
import './Label.css';

export const Label = ({ htmlFor, children, required = false }: ILabel) => {
    return (
        <label className="label" htmlFor={htmlFor}>
            {children}
            {required ? <span style={{ color: 'red', fontWeight: 700 }}>*</span> : null}
        </label>
    );
};

interface ILabel {
    htmlFor: string;
    required?: boolean;
    children: string;
}
