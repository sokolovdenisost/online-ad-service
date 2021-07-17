import { useState, useEffect } from 'react';
import { URL_API } from '../CONSTS';

interface IUser {
    user_id: number;
    user_email: string;
    user_date_register: string;
    user_password: string;
    user_place: string | null;
    user_phone: string | null;
    user_token: string;
}

export const useAuth = () => {
    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) {
            fetch(`${URL_API}/auth/auth`, {
                method: 'GET',
                headers: {
                    Authorization: `Token ${token}`,
                },
            })
                .then((res) => res.json())
                .then((res) => {
                    if (!res.error) {
                        setUser(res.user);
                        localStorage.setItem('user_id', res.user.user_id);
                        setLoading(false);
                    } else if (res.error) {
                        setUser(null);
                        setLoading(false);
                    }
                });
        } else {
            setLoading(false);
        }
    }, [token]);

    return { user, loading };
};
