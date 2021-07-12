import React from 'react';
import './Search.css';

export const Search = ({ search }: ISearch) => {
    return (
        <input
            onChange={(e) => search(e)}
            type="text"
            className="search"
            placeholder="Поиск среди контактов"
        />
    );
};

interface ISearch {
    search: any;
}
