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
// TODO
function sendMessage(ws, req) {
    return __awaiter(this, void 0, void 0, function* () {
        let messages = [];
        ws.on('message', function (data) {
            messages = [...messages, data];
            ws.send(JSON.stringify(messages));
        });
    });
}
function createMessageRoom(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { owner, enemy } = yield req.body;
        db_1.connection.query(`
        SELECT * FROM service.messages_rooms
        WHERE message_room_owner = ${owner} AND message_room_enemy = ${enemy}
    `, (err, result) => {
            if (err) {
                res.json({ error: 'Чтото пошло не так', message: 'Ошибка' });
            }
            if (result.length) {
                res.json({ message: 'Уже есть комната' });
            }
            else if (!result.length) {
                createRoom(res, owner, enemy, null);
            }
        });
    });
}
function createRoom(res, owner, enemy, room_id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (room_id) {
            db_1.connection.query(`
                UPDATE service.messages_rooms 
                SET message_room_id = ${room_id}
                WHERE message_room_owner = ${owner} AND message_room_enemy = ${enemy} OR message_room_owner = ${enemy} AND message_room_enemy = ${owner}
            `, [room_id, owner, enemy], (err, result) => {
                if (err) {
                    res.json({ error: 'Чтото пошло не так', message: 'Ошибка' });
                }
                if (!err) {
                    res.json({ message: 'Успешно добавили комнату для сообщений' });
                }
            });
        }
        else {
            db_1.connection.query(`
                INSERT INTO service.messages_rooms(message_room_owner, message_room_enemy)
                VALUES (${owner}, ${enemy}), (${enemy}, ${owner})
            `, (err, result) => {
                if (err) {
                    res.json({ error: 'Чтото пошло не так', message: 'Ошибка' });
                }
                if (!err) {
                    createRoom(res, owner, enemy, result.insertId);
                }
            });
        }
    });
}
function getRoomsForId(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { author } = yield req.body;
        db_1.connection.query(`
    SELECT * FROM service.messages_rooms, service.users
    WHERE message_room_owner = ${parseInt(author)} AND user_id = message_room_enemy
    `, (err, result) => {
            if (err) {
                res.json({ error: 'Чтото пошло не так', message: 'Ошибка' });
            }
            if (!err) {
                res.json({ message: 'Все комнаты', rooms: result });
            }
        });
    });
}
function getMessages(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { author, from } = yield req.body;
        db_1.connection.query(`
        SELECT * FROM service.messages
        WHERE message_author = ${parseInt(author)} AND message_from = ${parseInt(from)} 
        OR message_author = ${parseInt(from)} AND message_from = ${parseInt(author)}
    `, (err, result) => {
            if (err) {
                res.json({ error: 'Чтото пошло не так', message: 'Ошибка' });
            }
            if (!err) {
                res.json({ message: 'Все сообщения', messages: result });
            }
        });
    });
}
module.exports = { sendMessage, createMessageRoom, getRoomsForId, getMessages };
//# sourceMappingURL=chat.js.map