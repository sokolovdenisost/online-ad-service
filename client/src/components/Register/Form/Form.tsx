import React, { useState } from 'react';
import { Input } from '../../UI/InputUI/Input';
import { Label } from '../../UI/LabelUI/Label';
import { Button } from '../../UI/ButtonUI/Button';
import './Form.css';

export const Form = ({ setNotif }: IForm) => {
    const [form, setForm] = useState({
        email: '',
        password: '',
        refpassword: '',
        name: '',
        surname: '',
    });

    const [errors, setErrors] = useState({
        email: '',
        password: '',
        refpassword: '',
        name: '',
        surname: '',
    });

    function validateEmail(email: string) {
        let pattern =
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(email);
    }

    async function registerUser(e: React.MouseEvent) {
        checkValidate();

        if (form.email && form.password && form.refpassword && validateEmail(form.email)) {
            if (form.password === form.refpassword) {
                await fetch('http://localhost:3001/auth/register', {
                    method: 'POST',
                    body: JSON.stringify({ ...form }),
                    headers: {
                        Accept: '*/*',
                        'Content-Type': 'application/json',
                    },
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
                                text: res.message,
                                active: true,
                                type: 'success',
                            });
                        }
                    });
            } else if (form.password !== form.refpassword) {
                setNotif({
                    title: 'Ошибка',
                    text: 'Пароли не сходятся',
                    active: true,
                    type: 'error',
                });
            }
        }
    }

    function checkValidate() {
        if (form.email === '' || !validateEmail(form.email)) {
            setErrors((state) => ({ ...state, email: 'Введите корректный email' }));
        }

        if (form.name === '') {
            setErrors((state) => ({ ...state, name: 'Введите корректное имя' }));
        }

        if (form.surname === '') {
            setErrors((state) => ({ ...state, surname: 'Введите корректную фамилию' }));
        }

        if (form.password === '') {
            setErrors((state) => ({ ...state, password: 'Введите корректный пароль' }));
        }

        if (form.refpassword === '') {
            setErrors((state) => ({ ...state, refpassword: 'Введите корректный пароль' }));
        }
    }

    return (
        <div className="register-form">
            <Label htmlFor="email" required={true}>
                Email
            </Label>
            <Input
                setState={setForm}
                error={errors.email}
                value={form.email}
                id="email"
                placeholder="Введите email"
            />
            <div className="register-person">
                <div>
                    <Label htmlFor="name" required={true}>
                        Имя
                    </Label>
                    <Input
                        setState={setForm}
                        error={errors.name}
                        value={form.name}
                        id="name"
                        placeholder="Введите имя"
                    />
                </div>
                <div>
                    <Label htmlFor="surname" required={true}>
                        Фамилия
                    </Label>
                    <Input
                        setState={setForm}
                        error={errors.surname}
                        value={form.surname}
                        id="surname"
                        placeholder="Введите фамилию"
                    />
                </div>
            </div>
            <Label htmlFor="password" required={true}>
                Пароль
            </Label>
            <Input
                setState={setForm}
                error={errors.password}
                value={form.password}
                id="password"
                type="password"
                placeholder="Введите пароль"
            />
            <Label htmlFor="refpassword" required={true}>
                Подтверждение пароля
            </Label>
            <Input
                setState={setForm}
                error={errors.refpassword}
                value={form.refpassword}
                id="refpassword"
                type="password"
                placeholder="Подтвердите пароль"
            />
            <Button margin="25px 0 0" func={registerUser} color="bluebold">
                Зарегистрировать аккаунт
            </Button>
        </div>
    );
};

interface IForm {
    setNotif: React.Dispatch<
        React.SetStateAction<{ title: string; text: string; active: boolean; type: string }>
    >;
}
