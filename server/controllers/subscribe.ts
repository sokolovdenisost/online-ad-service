import { connection } from '../db';

async function getSubscribersById(req, res) {
    const { id } = await req.params;

    connection.query(
        `
    SELECT * FROM service.subscribers
    WHERE sub_to_id = ${id} OR sub_id = ${id}
    `,
        (err, result) => {
            if (err) {
                res.json({ error: 'Чтото пошло не так', message: 'Ошибка' });
            }

            if (!err) {
                const subId = [];
                const subToId = [];

                for (let elem of result) {
                    if (elem.sub_id === +id) {
                        subId.push(elem);
                    } else if (elem.sub_to_id === +id) {
                        subToId.push(elem);
                    }
                }
                res.json({ message: 'Подписчики', subscribers: subToId, subscriptions: subId });
            }
        },
    );
}

async function toggleSubscribe(req, res) {
    const { sub_to_id, sub_id } = await req.body;

    connection.query(
        `
        SELECT * FROM service.subscribers
        WHERE sub_id = ${sub_id} AND sub_to_id = ${sub_to_id}
    `,
        (err, result) => {
            if (err) {
                res.json({ error: 'Чтото пошло не так', message: 'Ошибка' });
            }

            console.log(result.length ? true : null);
            console.log(!result.length ? true : null);

            if (!err) {
                if (!result.length) {
                    subscribeHandler(res, sub_id, sub_to_id);
                } else if (result.length) {
                    unSubscribeHandler(res, sub_id, sub_to_id);
                }
            }
        },
    );
}

async function subscribeHandler(res, sub_id, sub_to_id) {
    connection.query(
        `
        INSERT INTO service.subscribers(sub_id, sub_to_id)
        VALUES(?, ?)
    `,
        [sub_id, sub_to_id],
        (err, result) => {
            if (err) {
                res.json({ error: 'Чтото пошло не так', message: 'Ошибка' });
            }

            if (!err) {
                res.json({ message: 'Подписались' });
            }
        },
    );
}

async function unSubscribeHandler(res, sub_id, sub_to_id) {
    connection.query(
        `
        DELETE FROM service.subscribers
        WHERE sub_id = ${sub_id} AND sub_to_id = ${sub_to_id}
    `,
        (err, result) => {
            if (err) {
                res.json({ error: 'Чтото пошло не так', message: 'Ошибка' });
            }

            if (!err) {
                res.json({ message: 'Отписались' });
            }
        },
    );
}

module.exports = {
    getSubscribersById,
    toggleSubscribe,
};
