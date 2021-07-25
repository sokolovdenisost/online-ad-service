"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../db");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
function registerUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password, name, surname } = yield req.body;
        const ERR_DUP = 'ER_DUP_ENTRY';
        const dateNow = new Date().toLocaleDateString();
        const hashPassword = bcrypt.hashSync(password, saltRounds);
        db_1.connection.query(`
        INSERT INTO service.users(user_email, user_password, user_date_register, user_name, user_surname)
        VALUES (?, ?, ?, ?, ?)
    `, [email, hashPassword, dateNow, name, surname], (err, result) => {
            if (!err) {
                res.json({ message: 'Успешно зарегистрировались' });
            }
            else if (err.code === ERR_DUP) {
                res.json({ error: 'Этот email уже используется', message: 'Ошибка' });
            }
        });
    });
}
function updateToken(email, token) {
    db_1.connection.query(`
        UPDATE service.users
        SET user_token = '${token}'
        WHERE user_email = '${email}';
    `, (err, result) => {
        if (err)
            return new Error(err);
    });
}
function loginUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = yield req.body;
        const token = jwt.sign({ foo: 'bar' }, 'secret key');
        db_1.connection.query(`
        SELECT * FROM service.users
        WHERE user_email = '${email}'
    `, (err, result) => {
            if (!err) {
                if (result.length) {
                    const checkPassword = bcrypt.compareSync(password, result[0].user_password);
                    if (checkPassword) {
                        updateToken(email, token);
                        res.json({ message: 'Успешно зашли', token: token });
                    }
                    else if (!checkPassword) {
                        res.json({ error: 'Данные не верны', message: 'Ошибка' });
                    }
                }
                else if (!result.length) {
                    res.json({ error: 'Пользователь с таким email ненайден', message: 'Ошибка' });
                }
            }
            else {
                res.json({ error: 'Ошибка попробуйте позже', message: 'Ошибка' });
            }
        });
    });
}
function authUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.header('Authorization').split(' ')[1];
        db_1.connection.query(`
        SELECT * FROM service.users
        WHERE user_token = '${token}'
    `, (err, result) => {
            if (err) {
                res.json({ message: 'Ошибка', error: 'Чтото пошло не так' });
            }
            if (!err) {
                if (result.length) {
                    res.json({ message: `Пользователь: ID ${result[0].user_id}`, user: result[0] });
                }
                else {
                    res.json({
                        error: 'Не авторизированны',
                        message: 'Вы не авторизированны',
                        user: null,
                    });
                }
            }
        });
    });
}
function logoutUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.header('Authorization').split(' ')[1];
        db_1.connection.query(`
        UPDATE service.users
        SET user_token = ''
        WHERE user_token = '${token}'
    `, (err, result) => {
            if (err) {
                res.json({ message: 'Ошибка', error: 'Чтото пошло не так' });
            }
            if (!err) {
                res.json({ message: 'Успешно вышли' });
            }
        });
    });
}
module.exports = {
    registerUser,
    loginUser,
    authUser,
    logoutUser,
};
//# sourceMappingURL=auth.js.map