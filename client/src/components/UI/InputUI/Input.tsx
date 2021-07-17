import React from 'react';
import './Input.css';
import { useChangeInput } from '../../../hooks/useChangeInput';

export const Input = ({
    placeholder,
    id,
    type = 'text',
    margin,
    value,
    error,
    setState,
}: IInput) => {
    const errorStyle = {
        margin: margin,
        border: error ? '1px solid var(--error-color)' : '1px solid var(--main-color)',
    };

    const setInput = useChangeInput(setState);

    return (
        <div className="input-block">
            <input
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setInput(event)}
                type={type}
                id={id}
                value={value}
                className="input"
                placeholder={placeholder}
                style={{ ...errorStyle }}
            />
            {error ? <div className="input-error">{error}</div> : null}
        </div>
    );
};

export const InputFile = ({ id, change, multiple = true }: IInput) => {
    return (
        <input
            onChange={(e) => change(e, 'file')}
            className="input-file"
            id={id}
            type="file"
            name="photos"
            multiple={multiple}
        />
    );
};

interface IInput {
    placeholder?: string;
    id: string;
    type?: string;
    margin?: string;
    change?: any;
    value?: string;
    error?: string;
    setState?: any;
    multiple?: boolean;
}
