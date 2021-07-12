import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Navigator } from '../components/Navigator/Navigator';
import { Ad } from '../pages/Ad/Ad';
import { Create } from '../pages/Create/Create';
import { Edit } from '../pages/Edit/Edit';
import { Favorites } from '../pages/Favorites/Favorites';
import { Login } from '../pages/Login/Login';
import { Main } from '../pages/Main/Main';
import { Messages } from '../pages/Messages/Messages';
import { Register } from '../pages/Register/Register';
import { Settings } from '../pages/Settings/Settings';
import { User } from '../pages/User/User';

export const useRoutes = (auth) => {
    if (auth) {
        return (
            <>
                <Navigator auth={auth} />
                <Switch>
                    <Route path="/" exact>
                        <Main />
                    </Route>
                    <Route path="/ad/:id" exact>
                        <Ad />
                    </Route>
                    <Route path="/user/:id" exact>
                        <User user={auth} />
                    </Route>
                    <Route path="/create" exact>
                        <Create />
                    </Route>
                    <Route path="/edit/:id" exact>
                        <Edit />
                    </Route>
                    <Route path="/favorite" exact>
                        <Favorites />
                    </Route>
                    <Route path="/messages" exact>
                        <Messages />
                    </Route>
                    <Route path="/settings" exact>
                        <Settings auth={auth} />
                    </Route>
                    <Redirect to="/" />
                </Switch>
            </>
        );
    }

    return (
        <Switch>
            <Route path="/login" exact>
                <Login />
            </Route>
            <Route path="/register" exact>
                <Register />
            </Route>
            <Route path="/" exact>
                <Navigator auth={auth} />
                <Main />
            </Route>
            <Route path="/user/:id" exact>
                <Navigator auth={auth} />
                <User />
            </Route>
            <Route path="/ad/:id" exact>
                <Navigator auth={auth} />
                <Ad />
            </Route>
            <Redirect to="/login" />
        </Switch>
    );
};
