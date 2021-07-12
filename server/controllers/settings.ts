import { connection } from '../db';
import { cloudinary } from './cloudinary';
const bcrypt = require('bcrypt');
const saltRounds = 10;

async function changePassword(req, res) {
    const { user_id, old_hash_password, old_password, new_password } = await req.body;
    const check = bcrypt.compareSync(old_password, old_hash_password);

    if (check) {
        const hashPassword = bcrypt.hashSync(new_password, saltRounds);
        connection.query(
            `
            UPDATE service.users
            SET user_password = '${hashPassword}'
            WHERE user_id = ${user_id};
        `,
            (err, result) => {
                if (err) {
                    res.json({ error: 'Что-то пошло не так', message: 'Ошибка' });
                }

                if (!err) {
                    res.json({ message: 'Успешно поменяли пароль' });
                }
            },
        );
    } else if (!check) {
        res.json({ error: 'Старый пароль неверный', message: 'Ошибка' });
    }
}

async function changePersonalDate(req, res) {
    const { name, surname, email, user_id } = await req.body;
    if (req.files) {
        const file = await req.files['avatar'];
        if (file) {
            connection.query(
                `
                UPDATE service.users
                SET user_name = '${name}', user_surname = '${surname}', user_email = '${email}'
                WHERE user_id = ${user_id};
            `,
                (err, result) => {
                    if (err) {
                        res.json({ error: 'Чтото пошло не так', message: 'Ошибка' });
                    }

                    if (!err) {
                        addAvatarInDB(res, file, user_id);
                    }
                },
            );
        } else if (!file) {
            connection.query(
                `
                UPDATE service.users
                SET user_name = '${name}', user_surname = '${surname}', user_email = '${email}'
                WHERE user_id = ${user_id};
            `,
                (err, result) => {
                    if (err) {
                        res.json({ error: 'Чтото пошло не так', message: 'Ошибка' });
                    }

                    if (!err) {
                        res.json({ message: 'Успешно сменили персональные данные аккаунта' });
                    }
                },
            );
        }
    } else if (!req.files) {
        connection.query(
            `
            UPDATE service.users
            SET user_name = '${name}', user_surname = '${surname}', user_email = '${email}'
            WHERE user_id = ${user_id};
        `,
            (err, result) => {
                if (err) {
                    res.json({ error: 'Чтото пошло не так', message: 'Ошибка' });
                }

                if (!err) {
                    res.json({ message: 'Успешно сменили персональные данные аккаунта' });
                }
            },
        );
    }
}

function addAvatarInDB(res, file, id: number) {
    cloudinary.v2.uploader.upload(file.tempFilePath, function (error, result) {
        if (error) {
            res.json({ message: 'Ошибка', error: 'Чтото пошло не так' });
        }
        if (!error) {
            connection.query(
                `
                UPDATE service.users
                SET user_avatar = '${result.url}'
                WHERE user_id = ${id};
            `,
                (err, result) => {
                    if (err) {
                        res.json({ error: 'Чтото пошло не так', message: 'Ошибка' });
                    }

                    if (!err) {
                        res.json({ message: 'Успешно сменили персональные данные аккаунта' });
                    }
                },
            );
        }
    });
}

module.exports = {
    changePassword,
    changePersonalDate,
};
