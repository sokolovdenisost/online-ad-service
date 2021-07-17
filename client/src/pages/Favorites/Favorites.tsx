import React, { useEffect, useState } from 'react';
import { AdCard } from '../../components/AdCard/AdCard';
import { Loader } from '../../components/UI/Loader/Loader';
import { URL_API } from '../../CONSTS';
import { CMain } from '../../containers/Main/CMain';
import './Favorites.css';

export const Favorites = () => {
    const [ads, setAds] = useState<Array<IFavoriteAds>>([]);
    const [loading, setLoading] = useState(true);
    const user_id = localStorage.getItem('user_id');

    useEffect(() => {
        fetch(`${URL_API}/ads/favorites`, {
            method: 'POST',
            body: JSON.stringify({ user_id: user_id }),
            headers: {
                Accept: '*/*',
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((res) => {
                setAds(res.ads);
                setLoading(false);
            });
    }, [user_id]);

    const mapFavoriteAds = ads
        .map((a) => {
            return (
                <AdCard
                    favorite={a.ad_id === a.favorite_id && Number(user_id) === a.favorite_user}
                    key={a.ad_id}
                    id={a.ad_id}
                    name={a.ad_name}
                    category={a.ad_category}
                    city={a.ad_city}
                    price={a.ad_price}
                    photo={a.ad_photo}
                    date={a.ad_date}
                    edit={a.ad_creator === Number(user_id)}
                />
            );
        })
        .reverse();

    if (loading) return <Loader />;

    return (
        <CMain>
            <div className="favorites-block">
                {ads.length ? (
                    <div className="favorites-ads">{mapFavoriteAds}</div>
                ) : (
                    <div className="favorites-noads">В избранном ничего нету</div>
                )}
            </div>
        </CMain>
    );
};

interface IFavoriteAds {
    favorite_id: number;
    favorite_user: number;
    ad_creator: number;
    ad_id: number;
    ad_name: string;
    ad_category: string;
    ad_city: string;
    ad_price: string;
    ad_photo: string;
    ad_date: string;
}
