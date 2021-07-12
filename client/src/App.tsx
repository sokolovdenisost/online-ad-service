import React from 'react';

import { useRoutes } from './hooks/routes';
import { useAuth } from './hooks/auth';
import { Loader } from './components/UI/Loader/Loader';

interface IUser {
    user_id: number;
    user_email: string;
    user_date_register: string;
    user_password: string;
    user_place: string | null;
    user_phone: string | null;
    user_token: string;
}

function App() {
    const auth = useAuth();
    const routes = useRoutes(auth.user);
    return <>{auth.loading ? <Loader /> : routes}</>;
}

export default App;
