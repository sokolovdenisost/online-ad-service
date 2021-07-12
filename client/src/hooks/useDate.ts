import React from 'react';

export const useDate = (date: string, type: string) => {
    const arrDate = date.split(', ');
    if (type === 'time') {
        return arrDate[1].split(':')[0] + ':' + arrDate[1].split(':')[1];
    } else if (type === 'date') {
        const yestarday = new Date();
        const yestardayDay = String(yestarday.getDate() - 1).padStart(2, '0');
        const month = yestarday.getMonth() + 1;
        const year = String(yestarday.getFullYear());

        const months = [
            'Января',
            'Февраля',
            'Марта',
            'Апреля',
            'Мая',
            'Июня',
            'Июля',
            'Августа',
            'Сентября',
            'Октября',
            'Ноября',
            'Декабря',
        ];

        if (arrDate[0] === new Date().toLocaleDateString()) {
            return 'Сегодня';
        } else if (
            arrDate[0].split('.')[0] === yestardayDay &&
            arrDate[0].split('.')[1] === String(month).padStart(2, '0')
        ) {
            return 'Вчера';
        } else if (
            arrDate[0] < new Date().toLocaleDateString() &&
            arrDate[0].split('.')[2] === year
        ) {
            return arrDate[0].split('.')[0] + ' ' + months[month - 1];
        }
    }
};
