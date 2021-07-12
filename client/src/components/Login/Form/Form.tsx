import React, { useState } from 'react';
import { Button } from '../../UI/ButtonUI/Button';
import { Input } from '../../UI/InputUI/Input';
import { Label } from '../../UI/LabelUI/Label';
import './Form.tsx';

export const Form = ({ setNotif }: IForm) => {
    const [form, setForm] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });

    function validateEmail(email: string) {
        let pattern =
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(email);
    }

    async function loginUser() {
        checkValidate();

        if (form.email && form.password && validateEmail(form.email)) {
            await fetch('http://localhost:3001/auth/login', {
                method: 'POST',
                body: JSON.stringify({ ...form }),
                headers: {
                    Accept: '*/*',
                    'Content-type': 'application/json',
                },
            })
                .then((res) => res.json())
                .then((res) => {
                    if (res.error) {
                        setNotif({
                            active: true,
                            title: res.message,
                            text: res.error,
                            type: 'error',
                        });
                    } else if (!res.error) {
                        setNotif({
                            active: true,
                            title: 'Успешно',
                            text: res.message,
                            type: 'success',
                        });
                        localStorage.setItem('token', res.token);
                    }
                });
        }
    }

    function checkValidate() {
        if (form.email === '' || !validateEmail(form.email)) {
            setErrors((state) => ({ ...state, email: 'Введите корректный email' }));
        } else if (form.email !== '' && validateEmail(form.email)) {
            setErrors((state) => ({ ...state, email: '' }));
        }

        if (form.password === '') {
            setErrors((state) => ({ ...state, password: 'Введите корректный пароль' }));
        } else if (form.password !== '') {
            setErrors((state) => ({ ...state, password: '' }));
        }
    }

    return (
        <div className="login-form">
            <Label htmlFor="email">Email</Label>
            <Input
                error={errors.email}
                value={form.email}
                setState={setForm}
                id="email"
                placeholder="Введите email"
            />
            <Label htmlFor="password">Пароль</Label>
            <Input
                error={errors.password}
                value={form.password}
                setState={setForm}
                id="password"
                type="password"
                placeholder="Введите пароль"
            />
            <Button func={loginUser} margin="70px 0 0" color="bluebold">
                Авторизировать аккаунт
            </Button>
        </div>
    );
};

interface IForm {
    setNotif: React.Dispatch<
        React.SetStateAction<{ title: string; text: string; active: boolean; type: string }>
    >;
}
