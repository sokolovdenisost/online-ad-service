import React, { useState, useEffect } from 'react';
import { MdFavoriteBorder, MdClose } from 'react-icons/md';

import { ProfileButton } from '../../components/Profile/Button/Button';
import { Info } from '../../components/Profile/Info/Info';
import { Ads } from '../../components/Profile/Sections/Ads/Ads';
import { Services } from '../../components/Profile/Sections/Services/Services';
import { Loader } from '../../components/UI/Loader/Loader';
import { Button } from '../../components/User/Button/Button';
import { URL_API } from '../../CONSTS';
import { CMain } from '../../containers/Main/CMain';
import { Error404 } from '../Error/404/404';
import './User.css';

export const User = () => {
    const [user, setUser] = useState<IUser>({
        user_id: 1,
        user_email: '',
        user_name: '',
        user_surname: '',
        user_date_register: '',
        user_place: '',
        user_phone: '',
        user_token: '',
        user_avatar: '',
    });
    const [ads, setAds] = useState<Array<IAds>>([]);
    const [favoriteAds, setFavoriteAds] = useState<Array<any>>([]);
    const [subscribers, setSubscribers] = useState<Array<ISubscribers>>([]);
    const [subscriptions, setSubscriptions] = useState<Array<ISubscribers>>([]);
    const [loading, setLoading] = useState(true);
    const [section, setSection] = useState({
        ads: true,
        services: false,
    });
    const [error, setError] = useState(false);

    const user_id = localStorage.getItem('user_id');

    function changeSections(key: string, value: Boolean): void {
        setSection({ ...section, ads: false, services: false, [key]: value });
    }

    useEffect(() => {
        const id = window.location.pathname.split('/')[2];
        fetch(`${URL_API}/user/${id}`)
            .then((res) => res.json())
            .then((res) => {
                if (res.error) {
                    setError(true);
                }
                setAds(res.ads);
                setUser(res.user);
                setLoading(true);
            });

        fetch(`${URL_API}/ads/favorites/#{user_id}`)
            .then((res) => res.json())
            .then((res) => {
                setFavoriteAds(res.ads);
                setLoading(true);
            });

        fetch(`${URL_API}/subscribe/${id}`)
            .then((res) => res.json())
            .then((res) => {
                setSubscribers(res.subscribers);
                setSubscriptions(res.subscriptions);
                setLoading(false);
            });
    }, []);

    function toggleSubscribe() {
        const sub_to_id = window.location.pathname.split('/')[2];
        fetch(`${URL_API}/subscribe/toggle`, {
            method: 'POST',
            body: JSON.stringify({ sub_to_id: sub_to_id, sub_id: user_id }),
            headers: {
                Accept: '*/*',
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((res) => {
                if (!res.error) {
                    window.location.reload(true);
                }
            });
    }

    const checkSub = subscribers.filter((sub) => sub.sub_id === Number(user_id));

    if (error) return <Error404 />;

    if (loading) return <Loader />;

    return (
        <CMain>
            <div className="user-container">
                <div className="user-page">
                    <div className="user-left">
                        <img src={user.user_avatar} alt="" className="user-image" />
                        <Info user={user} subscribers={subscribers} subscriptions={subscriptions} />
                        <ProfileButton
                            change={changeSections}
                            active={section.ads}
                            title="Объявления"
                            count={ads.length}
                            objKey="ads"
                        />
                        <ProfileButton
                            change={changeSections}
                            active={section.services}
                            title="Услуги"
                            count={1}
                            objKey="services"
                        />
                        {user.user_id === Number(user_id) || !user_id ? null : checkSub.length ? (
                            <Button type="unsub" title="Отписаться" func={toggleSubscribe}>
                                <MdClose size={24} />
                            </Button>
                        ) : (
                            <Button type="sub" title="Подписаться" func={toggleSubscribe}>
                                <MdFavoriteBorder size={24} />
                            </Button>
                        )}
                    </div>
                    <div className="user-right">
                        {section.ads ? (
                            <Ads favoriteAds={favoriteAds} ads={ads} />
                        ) : section.services ? (
                            <Services />
                        ) : null}
                    </div>
                </div>
            </div>
        </CMain>
    );
};

interface IUser {
    user_id: number | string;
    user_email: string;
    user_name: string;
    user_surname: string;
    user_date_register: string;
    user_place: string;
    user_phone: string;
    user_token: string;
    user_avatar: string;
}

interface IAds {
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
}

interface ISubscribers {
    sub: number;
    sub_id: number;
    sub_to_id: number;
}
