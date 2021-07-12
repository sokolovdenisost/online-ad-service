import React from 'react';
import './Select.css';

export const Select = ({ id, arr, change, error, value }: ISelect) => {
    const errorStyle = {
        border: error ? '1px solid var(--error-color)' : '1px solid var(--main-color)',
    };
    return (
        <div className="select">
            <select
                className="select-select"
                id={id}
                // value={value}
                defaultValue={value ? value : '0'}
                onChange={change}
                style={{ ...errorStyle }}>
                <option className="select-option" value="0" disabled>
                    Выберите категорию
                </option>
                {arr.map((a) => {
                    return (
                        <option key={a} className="select-option" value={a}>
                            {a}
                        </option>
                    );
                })}
            </select>
            {error ? <div className="select-error">{error}</div> : null}
        </div>
    );
};

interface ISelect {
    arr: Array<string>;
    change: any;
    id: string;
    error: string;
    value?: string;
}
