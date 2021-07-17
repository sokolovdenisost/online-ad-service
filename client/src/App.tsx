import React from 'react';

import { useRoutes } from './hooks/routes';
import { useAuth } from './hooks/auth';
import { Loader } from './components/UI/Loader/Loader';

export const App = () => {
    const auth = useAuth();
    const routes = useRoutes(auth.user);
    return <>{auth.loading ? <Loader /> : routes}</>;
};
