import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '../../UI/ButtonUI/Button';
import { Input, InputFile } from '../../UI/InputUI/Input';
import { Label } from '../../UI/LabelUI/Label';
import { Loader } from '../../UI/Loader/Loader';
import { Select } from '../../UI/Select/Select';
import { Subtitle } from '../../UI/Subtitle/Subtitle';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import './Form.css';

const CATEGORY = ['Одежда', 'Украшения', 'Мебель', 'Посуда', 'Техника', 'Книги', 'Недвижимость'];
const WAY_COMMUNICATE = ['Телефон', 'Личные сообщения', 'Телефон или личные сообщения'];

export const Form = ({ setNotif, form, setForm, photos, setPhotos }: IForm) => {
    let history = useHistory();
    const [deleteImages, setDeleteImages] = useState<any[]>([]);
    const [errors, setErrors] = useState({
        name: '',
        price: '',
        category: '',
        description: '',
        city: '',
        phone: '',
        youtube: '',
        way_communication: '',
    });

    function changeInputs(e: React.ChangeEvent<HTMLInputElement>, type: string) {
        if (type === 'file') {
            setForm({ ...form, [e.target.id]: e.target.files });
        }
    }

    function validateInputs() {
        setErrors({
            name: '',
            price: '',
            category: '',
            description: '',
            city: '',
            phone: '',
            youtube: '',
            way_communication: '',
        });
        let validateResult: boolean = true;
        if (form.ad_name.trim() === '') {
            setErrors((state) => ({ ...state, name: 'Введите корректное название' }));
            validateResult = false;
        }
        if (isNaN(Number(form.ad_price)) || form.ad_price.trim() === '') {
            setErrors((state) => ({ ...state, price: 'Введите корректную цену' }));
            validateResult = false;
        }
        if (form.ad_category.trim() === '') {
            setErrors((state) => ({ ...state, category: 'Введите корректную категорию' }));
            validateResult = false;
        }
        if (form.ad_description.trim() === '') {
            setErrors((state) => ({ ...state, description: 'Введите корректное описание' }));
            validateResult = false;
        }
        if (form.ad_city.trim() === '') {
            setErrors((state) => ({ ...state, city: 'Введите корректный адрес' }));
            validateResult = false;
        }
        if (form.ad_telephone.trim() === '') {
            setErrors((state) => ({ ...state, phone: 'Введите корректный номер' }));
            validateResult = false;
        }
        if (
            form.ad_youtube.trim() !== '' &&
            !form.ad_youtube.trim().includes('https://www.youtube.com/')
        ) {
            setErrors((state) => ({ ...state, youtube: 'Введите корректную ссылку на видео' }));
            validateResult = false;
        }
        if (form.ad_way_communication.trim() === '') {
            setErrors((state) => ({ ...state, way_communication: 'Выберите корректный способ' }));
            validateResult = false;
        }
        // Ошибки по длине символов
        if (form.ad_name.trim().length > 45) {
            setErrors((state) => ({ ...state, name: 'Это поле не должно превышать 45 символов' }));
            validateResult = false;
        }
        if (form.ad_city.trim().length > 20) {
            setErrors((state) => ({ ...state, city: 'Это поле не должно превышать 20 символов' }));
            validateResult = false;
        }
        if (!validateResult) {
            setNotif({
                title: 'Ошибка',
                text: 'Заполните все обязательные поля',
                active: true,
                type: 'error',
            });
        }
        return validateResult;
    }

    function changeArea(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setForm({ ...form, [e.target.id]: e.target.value });
    }

    function changeSelect(e: React.ChangeEvent<HTMLSelectElement>) {
        setForm({ ...form, [e.target.id]: e.target.value });
        setErrors({ ...errors, [e.target.id]: '' });
    }

    useEffect(() => {
        console.log(form);
        console.log(photos);
    }, [form, photos]);

    function deleteAdToId() {
        const id = window.location.pathname.split('/')[2];

        fetch(`http://localhost:3001/ads/delete/${id}`, {
            method: 'POST',
            headers: {
                Accept: '*/*',
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.error) {
                    console.log(res.error);
                } else if (!res.error) {
                    history.push('/');
                }
            });
    }

    function editAdToId() {
        const id = window.location.pathname.split('/')[2];

        if (validateInputs()) {
            const formData = new FormData();

            if (form.photos instanceof Object) {
                for (let i = 0; i < Array.from(form.photos).length; i++) {
                    formData.append('files', form.photos[i]);
                }
            }

            for (let elem of deleteImages) {
                formData.append('deleteImages', JSON.stringify(elem));
            }

            for (let [key, value] of Object.entries(form)) {
                formData.append(key, String(value));
            }

            fetch(`http://localhost:3001/ads/edit/${id}`, {
                method: 'POST',
                body: formData,
            })
                .then((res) => res.json())
                .then((res) => {
                    console.log(res.error ? res.error : res.message);
                    if (res.error) {
                        setNotif({
                            title: res.message,
                            text: res.error,
                            active: true,
                            type: 'error',
                        });
                    } else if (!res.error) {
                        setNotif({
                            title: 'Успешно',
                            text: res.message,
                            active: true,
                            type: 'success',
                        });
                    }
                });
        }
    }

    function deleteImageDownoload(e: React.MouseEvent<HTMLDivElement, MouseEvent>, type = 'a') {
        if (type === 'a') {
            const idx = Number(e.currentTarget.dataset.index);
            const element = photos.splice(idx, 1);
            const elements = photos.filter((c) => c !== element[0]);
            setPhotos([...elements]);
            setDeleteImages([...deleteImages, ...element]);
        } else if (type === 'b') {
            const name = e.currentTarget.dataset.index;
            const elements = Array.from(form.photos).filter((c) => c.name !== name);
            setForm({ ...form, photos: [...elements] });
        }
    }

    useEffect(() => {
        console.log(deleteImages);
    }, [deleteImages]);

    const downloadPhotos = form.photos ? Array.from(form.photos) : [];
    const mapAdPhotos = [...photos, ...downloadPhotos].map((file, index: number) => {
        const url = file.ad_photo_url ? file.ad_photo_url : URL.createObjectURL(file);
        return (
            <div className="edit-ad-photo" key={index}>
                <img className="edit-ad-image" src={url} alt="" />
                <div
                    className="edit-ad-delete"
                    data-index={file.ad_photo_url ? index : file.name}
                    onClick={(e) => deleteImageDownoload(e, file.ad_photo_url ? 'a' : 'b')}>
                    <IoIosCloseCircleOutline size={50} color="fff" />
                </div>
            </div>
        );
    });

    return (
        <div className="form-edit">
            <div className="form-edit-photo">
                <div className="form-edit-photo-center">
                    <div className="form-edit-photo-img">
                        <img src={form.ad_photo} alt="" />
                    </div>
                    <InputFile
                        multiple={false}
                        id="photo"
                        change={changeInputs}
                        placeholder="Фотографии"
                    />
                </div>
            </div>
            <div className="form-edit-roof">
                <div className="form-left">
                    <Label required={true} htmlFor="ad_name">
                        Название объявления
                    </Label>
                    <Input
                        setState={setForm}
                        id="ad_name"
                        value={form.ad_name}
                        placeholder="Введите название объявления"
                        error={errors.name}
                    />
                    <Label required={true} htmlFor="ad_price">
                        Цена товара
                    </Label>
                    <Input
                        error={errors.price}
                        setState={setForm}
                        id="ad_price"
                        placeholder="Введите цену товара"
                        value={form.ad_price}
                    />
                </div>
                <div className="form-right">
                    <Label required={true} htmlFor="ad_category">
                        Категория
                    </Label>
                    <Select
                        error={errors.category}
                        id="ad_category"
                        arr={CATEGORY}
                        change={changeSelect}
                        value={form.ad_category}
                    />
                    <Label htmlFor="ad_youtube">Видео с YouTube</Label>
                    <Input
                        error={errors.youtube}
                        setState={setForm}
                        id="ad_youtube"
                        placeholder="Например: https://youtube.com"
                        value={form.ad_youtube}
                    />
                </div>
            </div>
            <div className="form-edit-body">
                <Label required={true} htmlFor="ad_description">
                    Описание товара
                </Label>
                <textarea
                    onChange={changeArea}
                    id="ad_description"
                    className="text-description"
                    value={form.ad_description}></textarea>
            </div>
            <div className="form-edit-photos">
                <Label htmlFor="photos">Фотографии(максимум 10 фотографий)</Label>
                <InputFile id="photos" change={changeInputs} placeholder="Фотографии" />
                <div className="form-create-photos-img">{mapAdPhotos}</div>
            </div>
            <div className="form-edit-place">
                <Subtitle>Место встречи</Subtitle>
                <Label required={true} htmlFor="ad_city">
                    Адрес сделки
                </Label>
                <Input
                    value={form.ad_city}
                    error={errors.city}
                    setState={setForm}
                    id="ad_city"
                    placeholder="Введите адрес где будет происходить сделка"
                />
            </div>
            <div className="form-edit-feedback">
                <Subtitle>Контакты</Subtitle>
                <div className="form-feedback-block">
                    <div className="form-feedback-left">
                        <Label required={true} htmlFor="ad_phone">
                            Телефон
                        </Label>
                        <Input
                            value={form.ad_telephone}
                            error={errors.phone}
                            setState={setForm}
                            id="ad_phone"
                            placeholder="Введите номер телефона"
                        />
                    </div>
                    <div className="form-feedback-right">
                        <Label required={true} htmlFor="ad_way_communication">
                            Способ связи
                        </Label>
                        <Select
                            value={form.ad_way_communication}
                            error={errors.way_communication}
                            id="ad_way_communication"
                            arr={WAY_COMMUNICATE}
                            change={changeSelect}
                        />
                    </div>
                </div>
            </div>
            <div className="form-edit-footer">
                <Button margin="" color="redbold" func={deleteAdToId}>
                    Удалить объявление
                </Button>
                <Button margin="" color="bluebold" func={editAdToId}>
                    Редактировать объявление
                </Button>
            </div>
        </div>
    );
};

interface IForm {
    setNotif: React.Dispatch<
        React.SetStateAction<{ title: string; text: string; active: boolean; type: string }>
    >;
    form: IFormState;
    setForm: React.Dispatch<React.SetStateAction<IFormState>>;
    photos: any[];
    setPhotos: React.Dispatch<React.SetStateAction<any[]>>;
}

interface IFormState {
    [key: string]: any;
    ad_name: string;
    ad_price: string;
    ad_photo: string;
    ad_category: string;
    ad_description: string;
    ad_city: string;
    ad_telephone: string;
    ad_youtube: string;
    ad_way_communication: string;
    ad_creator: string | null;
    photos: Array<any>;
}
