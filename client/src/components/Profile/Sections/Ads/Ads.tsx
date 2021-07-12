import React from 'react';
import { AdCard } from '../../../AdCard/AdCard';
import './Ads.css';

export const Ads = ({ ads, favoriteAds }: IAds) => {
    const user_id = localStorage.getItem('user_id');
    console.log(ads);
    const mapAds = ads
        .map((a) => {
            const check = favoriteAds.filter((c) => c.favorite_id === a.ad_id);
            return (
                <AdCard
                    favorite={check[0] && check[0].favorite_user === Number(user_id)}
                    id={a.ad_id}
                    name={a.ad_name}
                    category={a.ad_category}
                    city={a.ad_city}
                    price={a.ad_price}
                    photo={a.ad_photo}
                    key={a.ad_id}
                    date={a.ad_date}
                    edit={a.ad_creator === Number(user_id)}
                />
            );
        })
        .reverse();

    return (
        <>
            {ads.length ? (
                <div className="ads-grid">{mapAds}</div>
            ) : (
                <div
                    style={{
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    Объявлений пока что нет.
                </div>
            )}
        </>
    );
};

interface IAds {
    ads: Array<{
        ad_id: number;
        ad_name: string;
        ad_creator: number;
        ad_price: string;
        ad_category: string;
        ad_youtube: string;
        ad_description: string;
        ad_city: string;
        ad_telephone: string;
        ad_way_communication: string;
        ad_photo: string;
        ad_date: string;
    }>;
    favoriteAds: Array<{
        favorite_id: number;
        favorite_user: number;
    }>;
}
