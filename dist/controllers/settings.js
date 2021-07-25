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
const cloudinary_1 = require("./cloudinary");
const bcrypt = require('bcrypt');
const saltRounds = 10;
function changePassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { user_id, old_hash_password, old_password, new_password } = yield req.body;
        const check = bcrypt.compareSync(old_password, old_hash_password);
        if (check) {
            const hashPassword = bcrypt.hashSync(new_password, saltRounds);
            db_1.connection.query(`
            UPDATE service.users
            SET user_password = '${hashPassword}'
            WHERE user_id = ${user_id};
        `, (err, result) => {
                if (err) {
                    res.json({ error: 'Что-то пошло не так', message: 'Ошибка' });
                }
                if (!err) {
                    res.json({ message: 'Успешно поменяли пароль' });
                }
            });
        }
        else if (!check) {
            res.json({ error: 'Старый пароль неверный', message: 'Ошибка' });
        }
    });
}
function changePersonalDate(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, surname, email, user_id } = yield req.body;
        if (req.files) {
            const file = yield req.files['avatar'];
            if (file) {
                db_1.connection.query(`
                UPDATE service.users
                SET user_name = '${name}', user_surname = '${surname}', user_email = '${email}'
                WHERE user_id = ${user_id};
            `, (err, result) => {
                    if (err) {
                        res.json({ error: 'Чтото пошло не так', message: 'Ошибка' });
                    }
                    if (!err) {
                        addAvatarInDB(res, file, user_id);
                    }
                });
            }
            else if (!file) {
                db_1.connection.query(`
                UPDATE service.users
                SET user_name = '${name}', user_surname = '${surname}', user_email = '${email}'
                WHERE user_id = ${user_id};
            `, (err, result) => {
                    if (err) {
                        res.json({ error: 'Чтото пошло не так', message: 'Ошибка' });
                    }
                    if (!err) {
                        res.json({ message: 'Успешно сменили персональные данные аккаунта' });
                    }
                });
            }
        }
        else if (!req.files) {
            db_1.connection.query(`
            UPDATE service.users
            SET user_name = '${name}', user_surname = '${surname}', user_email = '${email}'
            WHERE user_id = ${user_id};
        `, (err, result) => {
                if (err) {
                    res.json({ error: 'Чтото пошло не так', message: 'Ошибка' });
                }
                if (!err) {
                    res.json({ message: 'Успешно сменили персональные данные аккаунта' });
                }
            });
        }
    });
}
function addAvatarInDB(res, file, id) {
    cloudinary_1.cloudinary.v2.uploader.upload(file.tempFilePath, function (error, result) {
        if (error) {
            res.json({ message: 'Ошибка', error: 'Чтото пошло не так' });
        }
        if (!error) {
            db_1.connection.query(`
                UPDATE service.users
                SET user_avatar = '${result.url}'
                WHERE user_id = ${id};
            `, (err, result) => {
                if (err) {
                    res.json({ error: 'Чтото пошло не так', message: 'Ошибка' });
                }
                if (!err) {
                    res.json({ message: 'Успешно сменили персональные данные аккаунта' });
                }
            });
        }
    });
}
module.exports = {
    changePassword,
    changePersonalDate,
};
//# sourceMappingURL=settings.js.map