import { connection } from '../db';

// TODO
async function sendMessage(ws, req) {
    let messages = [];
    ws.on('message', function (data) {
        messages = [...messages, data];
        ws.send(JSON.stringify(messages));
    });
}

async function createMessageRoom(req, res) {
    const { owner, enemy } = await req.body;

    connection.query(
        `
        SELECT * FROM service.messages_rooms
        WHERE message_room_owner = ${owner} AND message_room_enemy = ${enemy}
    `,
        (err, result) => {
            if (err) {
                res.json({ error: 'Чтото пошло не так', message: 'Ошибка' });
            }

            if (result.length) {
                res.json({ message: 'Уже есть комната' });
            } else if (!result.length) {
                createRoom(res, owner, enemy, null);
            }
        },
    );
}

async function createRoom(res, owner, enemy, room_id) {
    if (room_id) {
        connection.query(
            `
                UPDATE service.messages_rooms 
                SET message_room_id = ${room_id}
                WHERE message_room_owner = ${owner} AND message_room_enemy = ${enemy} OR message_room_owner = ${enemy} AND message_room_enemy = ${owner}
            `,
            [room_id, owner, enemy],
            (err, result) => {
                if (err) {
                    res.json({ error: 'Чтото пошло не так', message: 'Ошибка' });
                }

                if (!err) {
                    res.json({ message: 'Успешно добавили комнату для сообщений' });
                }
            },
        );
    } else {
        connection.query(
            `
                INSERT INTO service.messages_rooms(message_room_owner, message_room_enemy)
                VALUES (${owner}, ${enemy}), (${enemy}, ${owner})
            `,
            (err, result) => {
                if (err) {
                    res.json({ error: 'Чтото пошло не так', message: 'Ошибка' });
                }

                if (!err) {
                    createRoom(res, owner, enemy, result.insertId);
                }
            },
        );
    }
}

async function getRoomsForId(req, res) {
    const { author } = await req.body;

    connection.query(
        `
    SELECT * FROM service.messages_rooms, service.users
    WHERE message_room_owner = ${parseInt(author)} AND user_id = message_room_enemy
    `,
        (err, result) => {
            if (err) {
                res.json({ error: 'Чтото пошло не так', message: 'Ошибка' });
            }

            if (!err) {
                res.json({ message: 'Все комнаты', rooms: result });
            }
        },
    );
}

async function getMessages(req, res) {
    const { author, from } = await req.body;

    connection.query(
        `
        SELECT * FROM service.messages
        WHERE message_author = ${parseInt(author)} AND message_from = ${parseInt(from)} 
        OR message_author = ${parseInt(from)} AND message_from = ${parseInt(author)}
    `,
        (err, result) => {
            if (err) {
                res.json({ error: 'Чтото пошло не так', message: 'Ошибка' });
            }

            if (!err) {
                res.json({ message: 'Все сообщения', messages: result });
            }
        },
    );
}

module.exports = { sendMessage, createMessageRoom, getRoomsForId, getMessages };
