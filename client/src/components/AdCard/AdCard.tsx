import React, { useState } from 'react';
import { MdFavoriteBorder, MdFavorite } from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import { BiEdit } from 'react-icons/bi';

import './AdCard.css';
import { useDate } from '../../hooks/useDate';

export const AdCard = ({
    id,
    name,
    category,
    city,
    price,
    photo,
    date,
    favorite = false,
    edit = false,
    preview = true,
}: IAdCard) => {
    const history = useHistory();
    const user_id = localStorage.getItem('user_id');
    const [isFavorite, setIsFavorite] = useState(favorite);
    const [info, setInfo] = useState({
        user_id: user_id,
        ad_id: id,
    });

    function toggleFavorite(e: React.MouseEvent) {
        e.preventDefault();
        setIsFavorite(!isFavorite);

        fetch('http://localhost:3001/ads/favorite', {
            method: 'POST',
            body: JSON.stringify({ ...info }),
            headers: {
                Accept: '*/*',
                'Content-Type': 'application/json',
            },
        }).then((res) => res.json());
    }

    function goToEdit(e: React.MouseEvent<HTMLDivElement>) {
        e.preventDefault();
        history.push(`/edit/${id}`);
    }

    return (
        <a href={preview ? `/ad/${id}` : '#'} className="adcard-block">
            <div className="adcard-image">
                <img src={preview ? photo : photo ? URL.createObjectURL(photo) : ''} alt="" />
                {user_id && preview ? (
                    <div className="adcard-favorite">
                        <div className="adcard-favorite-hover" onClick={(e) => toggleFavorite(e)}>
                            {isFavorite ? (
                                <MdFavorite size={26} color="FC5B5B" />
                            ) : (
                                <MdFavoriteBorder size={26} color="6E798C" />
                            )}
                        </div>
                    </div>
                ) : null}
                {edit ? (
                    <div className="adcard-edit" onClick={(e) => goToEdit(e)}>
                        <div className="adcard-edit-hover">
                            <BiEdit size={26} color="6E798C" />
                        </div>
                    </div>
                ) : null}
            </div>
            <div className="adcard-info">
                <div className="adcard-info-row">
                    <div className="adcard-category">{category}</div>
                    <div className="adcard-date">{useDate(date, 'date')}</div>
                </div>
                <div className="adcard-title">{name}</div>
                <div className="adcard-info-footer">
                    <div className="adcard-city">{city}</div>
                    <div className="adcard-price">{price} руб</div>
                </div>
            </div>
        </a>
    );
};

interface IAdCard {
    id?: number;
    name: string;
    category: string;
    city: string;
    price: string;
    photo: string;
    favorite?: boolean;
    edit?: boolean;
    preview?: boolean;
    date: string;
}
