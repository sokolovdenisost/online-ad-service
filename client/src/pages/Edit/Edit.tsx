import React, { useState, useEffect } from 'react';
import { Form } from '../../components/Edit/Form/Form';
import { Header } from '../../components/UI/HeaderUI/Header';
import { Loader } from '../../components/UI/Loader/Loader';
import { Notification } from '../../components/UI/Notification/Notification';
import { Subtitle } from '../../components/UI/Subtitle/Subtitle';
import { URL_API } from '../../CONSTS';
import { CCenter } from '../../containers/Center/CCenter';
import { Error404 } from '../Error/404/404';
import './Edit.css';

export const Edit = () => {
    const [notif, setNotif] = useState({
        title: '',
        text: '',
        active: false,
        type: '',
    });

    const [form, setForm] = useState<IFormState>({
        ad_name: '',
        ad_price: '',
        ad_photo: '',
        ad_category: '',
        ad_description: '',
        ad_city: '',
        ad_telephone: '',
        ad_youtube: '',
        ad_way_communication: '',
        ad_creator: '',
        photos: [],
    });
    const [photos, setPhotos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const id = window.location.pathname.split('/')[2];
        console.log(id);
        fetch(`${URL_API}/ads/edit/${id}`)
            .then((res) => res.json())
            .then((res) => {
                if (res.error) {
                    setError(true);
                }
                setPhotos(res.photos);
                setForm(res.ad);
                setLoading(false);
            });
    }, []);

    if (loading) return <Loader />;

    if (error) return <Error404 />;

    return (
        <CCenter>
            <>
                <Notification
                    setActive={setNotif}
                    active={notif.active}
                    title={notif.title}
                    text={notif.text}
                    type={notif.type}
                />
                <div className="edit-block">
                    <div className="edit-roof">
                        <Header>Редактирование объявления</Header>
                        <Subtitle>Параметры</Subtitle>
                    </div>
                    <Form
                        setNotif={setNotif}
                        form={form}
                        setForm={setForm}
                        photos={photos}
                        setPhotos={setPhotos}
                    />
                </div>
            </>
        </CCenter>
    );
};

interface IFormState {
    [key: string]: any;
    ad_name: string;
    ad_price: string;
    ad_category: string;
    ad_description: string;
    ad_city: string;
    ad_telephone: string;
    ad_youtube: string;
    ad_way_communication: string;
    ad_creator: string | null;
    ad_photo: string;
    photos: Array<any>;
}
