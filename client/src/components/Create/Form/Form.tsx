import React, { useState } from 'react';
import { Button } from '../../UI/ButtonUI/Button';
import { Input, InputFile } from '../../UI/InputUI/Input';
import { Label } from '../../UI/LabelUI/Label';
import { Select } from '../../UI/Select/Select';
import { Subtitle } from '../../UI/Subtitle/Subtitle';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { BsQuestion } from 'react-icons/bs';
import './Form.css';
import { Modal } from '../../Preview/Modal/Modal';
import { URL_API } from '../../../CONSTS';

const CATEGORY = ['Одежда', 'Украшения', 'Мебель', 'Посуда', 'Техника', 'Книги', 'Недвижимость'];
const WAY_COMMUNICATE = ['Телефон', 'Личные сообщения', 'Телефон или личные сообщения'];

export const Form = ({ setNotif }: IForm) => {
    const [form, setForm] = useState<IFormState>({
        name: '',
        price: '',
        photos: [],
        category: '',
        description: '',
        city: '',
        phone: '',
        youtube: '',
        way_communication: '',
        photo: '',
        date: '',
        creator: localStorage.getItem('user_id'),
    });
    const [preview, setPreview] = useState(false);

    const [errors, setErrors] = useState({
        name: '',
        price: '',
        category: '',
        description: '',
        city: '',
        phone: '',
        youtube: '',
        photo: '',
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
            photo: '',
            way_communication: '',
        });
        let validateResult: boolean = true;

        if (form.name.trim() === '') {
            setErrors((state) => ({ ...state, name: 'Введите корректное название' }));
            validateResult = false;
        }

        if (!form.photo) {
            setErrors((state) => ({ ...state, photo: 'Загрузите фотографию' }));
            validateResult = false;
        }

        if (isNaN(Number(form.price)) || form.price.trim() === '') {
            setErrors((state) => ({ ...state, price: 'Введите корректную цену' }));
            validateResult = false;
        }

        if (form.category.trim() === '') {
            setErrors((state) => ({ ...state, category: 'Введите корректную категорию' }));
            validateResult = false;
        }

        if (form.description.trim() === '') {
            setErrors((state) => ({ ...state, description: 'Введите корректное описание' }));
            validateResult = false;
        }

        if (form.city.trim() === '') {
            setErrors((state) => ({ ...state, city: 'Введите корректный город' }));
            validateResult = false;
        }

        if (form.phone.trim() === '') {
            setErrors((state) => ({ ...state, phone: 'Введите корректный номер' }));
            validateResult = false;
        }

        if (
            form.youtube.trim() !== '' &&
            !form.youtube.trim().includes('https://www.youtube.com/')
        ) {
            setErrors((state) => ({ ...state, youtube: 'Введите корректную ссылку на видео' }));
            validateResult = false;
        }

        if (form.way_communication.trim() === '') {
            setErrors((state) => ({ ...state, way_communication: 'Выберите корректный способ' }));
            validateResult = false;
        }

        // Ошибки по длине символов
        if (form.name.trim().length > 45) {
            setErrors((state) => ({ ...state, name: 'Это поле не должно превышать 45 символов' }));
            validateResult = false;
        }

        if (form.city.trim().length > 20) {
            setErrors((state) => ({ ...state, city: 'Это поле не должно превышать 20 символов' }));
            validateResult = false;
        }

        if (!validateResult) {
            setNotif({
                title: 'Ошибка',
                text: 'Проверьте все ли правильно введено',
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

    function createAd() {
        if (validateInputs()) {
            const formData = new FormData();
            for (let i = 0; i < form.photos.length; i++) {
                formData.append('photos', form.photos[i]);
            }

            formData.append('photo', form.photo[0]);

            for (let elem in form) {
                formData.append(elem, form[elem]);
            }

            fetch(`${URL_API}/ads/create`, {
                method: 'POST',
                body: formData,
            })
                .then((res) => res.json())
                .then((res) => {
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
                            text: 'Создали объявление',
                            active: true,
                            type: 'success',
                        });
                    }
                });
        }
    }

    function deleteImageDownoload(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const idx = Number(e.currentTarget.dataset.index);
        const element = Array.from(form.photos).splice(idx, 1);
        const elements = Array.from(form.photos).filter((c) => c !== element[0]);
        setForm({ ...form, photos: elements });
    }

    function previewHandler() {
        if (validateInputs()) {
            setPreview(!preview);
        }
    }

    const mapDownoloadPhotos = Array.from(form.photos).map((file: Blob, index: number) => {
        const url = URL.createObjectURL(file);
        return (
            <div className="create-ad-photo" key={index}>
                <img
                    onClick={(e) => deleteImageDownoload(e)}
                    src={URL.createObjectURL(file)}
                    data-index={index}
                    key={url}
                    alt=""
                />
                <div
                    className="create-ad-delete"
                    data-index={index}
                    onClick={(e) => deleteImageDownoload(e)}>
                    <IoIosCloseCircleOutline size={50} color="fff" />
                </div>
            </div>
        );
    });

    return (
        <div className="form-create">
            <div className="form-create-photo">
                <div className="form-create-photo-center">
                    <div className="form-create-photo-img">
                        {form.photo ? (
                            <img src={URL.createObjectURL(form.photo[0])} alt="" />
                        ) : (
                            <BsQuestion size={150} color="b7b7b7" />
                        )}
                    </div>
                    <InputFile
                        multiple={false}
                        id="photo"
                        change={changeInputs}
                        placeholder="Фотографии"
                    />
                </div>
            </div>
            <div className="form-create-roof">
                <div className="form-left">
                    <Label required={true} htmlFor="name">
                        Название объявления
                    </Label>
                    <Input
                        setState={setForm}
                        id="name"
                        placeholder="Введите название объявления"
                        error={errors.name}
                    />
                    <Label required={true} htmlFor="price">
                        Цена товара
                    </Label>
                    <Input
                        error={errors.price}
                        setState={setForm}
                        id="price"
                        placeholder="Введите цену товара"
                    />
                </div>
                <div className="form-right">
                    <Label required={true} htmlFor="category">
                        Категория
                    </Label>
                    <Select
                        error={errors.category}
                        id="category"
                        arr={CATEGORY}
                        change={changeSelect}
                    />
                    <Label htmlFor="youtube">Видео с YouTube</Label>
                    <Input
                        error={errors.youtube}
                        setState={setForm}
                        id="youtube"
                        placeholder="Например: https://youtube.com"
                    />
                </div>
            </div>
            <div className="form-create-body">
                <Label required={true} htmlFor="description">
                    Описание товара
                </Label>
                <textarea
                    onChange={changeArea}
                    id="description"
                    className="text-description"></textarea>
            </div>
            <div className="form-create-photos">
                <Label htmlFor="photos">Фотографии(максимум 10 фотографий)</Label>
                <InputFile id="photos" change={changeInputs} placeholder="Фотографии" />
                <div className="form-create-photos-img">{mapDownoloadPhotos}</div>
            </div>
            <div className="form-create-place">
                <Subtitle>Место встречи</Subtitle>
                <Label required={true} htmlFor="city">
                    Город сделки
                </Label>
                <Input
                    error={errors.city}
                    setState={setForm}
                    id="city"
                    placeholder="Введите город где будет происходить сделка"
                />
            </div>
            <div className="form-create-feedback">
                <Subtitle>Контакты</Subtitle>
                <div className="form-feedback-block">
                    <div className="form-feedback-left">
                        <Label required={true} htmlFor="phone">
                            Телефон
                        </Label>
                        <Input
                            error={errors.phone}
                            setState={setForm}
                            id="phone"
                            placeholder="Введите номер телефона"
                        />
                    </div>
                    <div className="form-feedback-right">
                        <Label required={true} htmlFor="way_communication">
                            Способ связи
                        </Label>
                        <Select
                            error={errors.way_communication}
                            id="way_communication"
                            arr={WAY_COMMUNICATE}
                            change={changeSelect}
                        />
                    </div>
                </div>
            </div>
            <div className="form-create-footer">
                <Button func={previewHandler} margin="" color="bluebold">
                    Предпросмотр объявления
                </Button>
                <Button func={createAd} margin="" color="greenbold">
                    Разместить объявление
                </Button>
            </div>
            <Modal card={form} active={preview} setActive={setPreview} />
        </div>
    );
};

interface IForm {
    setNotif: React.Dispatch<
        React.SetStateAction<{ title: string; text: string; active: boolean; type: string }>
    >;
}

interface IFormState {
    [key: string]: any;
    name: string;
    price: string;
    photos: Array<Blob>;
    category: string;
    description: string;
    city: string;
    phone: string;
    youtube: string;
    way_communication: string;
    date: string;
    photo: any;
    creator: string | null;
}
