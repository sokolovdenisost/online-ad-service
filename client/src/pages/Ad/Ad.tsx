import React, { useState, useEffect } from 'react';
import { FiMapPin } from 'react-icons/fi';

import { Photos } from '../../components/Ad/Photos/Photos';
import { User } from '../../components/Ad/User/User';
import { Loader } from '../../components/UI/Loader/Loader';
import { CMain } from '../../containers/Main/CMain';
import { Error404 } from '../Error/404/404';
import './Ad.css';

export const Ad = () => {
    const [ad, setAd] = useState({
        ad_id: 1,
        ad_name: '',
        ad_creator: 1,
        ad_price: '',
        ad_category: '',
        ad_youtube: '',
        ad_description: '',
        ad_city: '',
        ad_telephone: '',
        ad_way_communication: '',
        ad_photo: '',
    });
    const [owner, setOwner] = useState({
        user_id: 1,
        user_name: '',
        user_surname: '',
        user_email: '',
        user_date_register: '',
        user_avatar: '',
    });
    const [photos, setPhotos] = useState<Array<IPhotos | IPhotosSmall>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const id = window.location.pathname.split('/')[2];
        fetch(`http://localhost:3001/ads/${id}`)
            .then((res) => res.json())
            .then((res) => {
                if (res.error) {
                    setError(true);
                }
                console.log(res);
                setAd(res.ad);
                setOwner(res.owner);
                setPhotos(res.photos);
                setLoading(false);
            });
    }, []);

    if (error) return <Error404 />;

    if (loading) return <Loader />;

    return (
        <CMain>
            <div className="ad-page">
                <div className="ad-page-roof">
                    <Photos arrayObj={[{ ad_photo_url: ad.ad_photo }, ...photos]} />
                    <div className="ad-page-user">
                        <User
                            way_com={ad.ad_way_communication}
                            telephone={ad.ad_telephone}
                            owner={owner}
                        />
                    </div>
                </div>
                <div className="ad-page-body">
                    <div className="ad-page-title">{ad.ad_name}</div>
                    <div className="ad-page-info">
                        <div className="ad-page-price">Цена: {ad.ad_price} руб</div>
                        <div className="ad-page-place">
                            <FiMapPin size={25} color="4a4b57" />
                            <span>{ad.ad_city}</span>
                        </div>
                    </div>
                    <div className="ad-page-description">
                        <div className="ad-page-description-title">Описание</div>
                        <div className="ad-page-description-text">{ad.ad_description}</div>
                    </div>
                    {ad.ad_youtube ? (
                        <div className="ad-page-youtube">
                            <div className="ad-page-youtube-title">Youtube</div>
                            <a className="ad-page-youtube-link" target="blank" href={ad.ad_youtube}>
                                Видео с youtube
                            </a>
                        </div>
                    ) : null}
                </div>
            </div>
        </CMain>
    );
};

interface IPhotos {
    ad_ad_id: number;
    ad_photo_url: string;
}

interface IPhotosSmall {
    ad_photo_url: string;
}
