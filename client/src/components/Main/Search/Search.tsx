import React from 'react';
import './Search.css';

const CATEGORY = ['Одежда', 'Украшения', 'Мебель', 'Посуда', 'Техника', 'Книги', 'Недвижимость'];

export const Search = ({ change, search, onSearch }: ISearch) => {
    function generateHref() {
        if (search.searchValue && search.searchCategory) {
            return (
                '?searchValue=' + search.searchValue + '?searchCategory=' + search.searchCategory
            );
        } else if (search.searchCategory) {
            return '?searchCategory=' + search.searchCategory;
        } else if (search.searchValue) {
            return '?searchValue=' + search.searchValue;
        }

        return '/';
    }

    return (
        <div className="main-search">
            <input
                onChange={(e) => change(e)}
                type="text"
                placeholder="Поиск"
                className="main-search-input"
                value={search.searchValue}
            />
            <select
                value={search.searchCategory ? search.searchCategory : '0'}
                onChange={(e) => change(e)}
                className="main-search-select">
                <option className="select-option" value="0" disabled>
                    Выберите категорию
                </option>
                <option className="select-option" value="Все">
                    Все
                </option>
                {CATEGORY.map((a) => {
                    return (
                        <option key={a} className="select-option" value={a}>
                            {a}
                        </option>
                    );
                })}
            </select>
            <a href={generateHref()}>
                <button className="main-search-button">Найти</button>
            </a>
        </div>
    );
};

interface ISearch {
    change: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    search: {
        searchValue: string;
        searchCategory: string;
    };
    onSearch?: () => void;
}
